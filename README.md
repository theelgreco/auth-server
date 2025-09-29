# auth-server

A TypeScript-based authentication server built with Deno, Express, and Prisma.

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd auth-server
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This will start both the auth server and a PostgreSQL database.

3. **The server will be available at:** `http://localhost:9091`

### Using Docker (Manual)

1. **Build the Docker image:**
   ```bash
   docker build -t auth-server .
   ```

2. **Run the container:**
   ```bash
   docker run -p 9091:9091 \
     -e DATABASE_URL="postgresql://user:password@host:5432/database" \
     -e JWT_KEY="your-secret-jwt-key" \
     auth-server
   ```

### Local Development

1. **Install Deno:**
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/database
   JWT_KEY=your-secret-jwt-key
   PORT=9091
   ```

3. **Run database migrations:**
   ```bash
   deno task migrate:dev
   ```

4. **Start the development server:**
   ```bash
   deno task dev
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_KEY` | Secret key for JWT signing | Required |
| `PORT` | Server port | `9091` |
| `NODE_ENV` | Environment mode | `development` |

## API Endpoints

- `POST /login` - User login
- `POST /sign-up` - User registration
- `POST /google-sign-in` - Google OAuth login

## Architecture

- **Runtime:** Deno 2.5.2
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
