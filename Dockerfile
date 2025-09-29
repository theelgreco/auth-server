# Use the official Deno image as base
FROM denoland/deno:2.5.2

# Set the working directory
WORKDIR /app

# Set environment to bypass SSL issues in container builds
ENV DENO_TLS_CA_STORE=system

# Copy deno.json and deno.lock first to leverage Docker layer caching
COPY deno.json deno.lock ./

# Copy prisma schema for generating client
COPY prisma ./prisma/

# Copy source code
COPY src ./src/
COPY contracts ./contracts/

# Pre-cache dependencies (without strict lock file to avoid SSL issues)
RUN deno cache src/app.ts || true

# Expose the port the app runs on
EXPOSE 9091

# Set environment variables for production
ENV NODE_ENV=production

# Create startup script to handle Prisma generation and app startup
RUN echo '#!/bin/sh\n\
echo "Generating Prisma client..."\n\
deno run -A npm:prisma generate\n\
echo "Running database migrations..."\n\
deno run -A npm:prisma migrate deploy\n\
echo "Starting application..."\n\
deno run --allow-all src/app.ts' > start.sh && chmod +x start.sh

# Use the startup script
CMD ["./start.sh"]