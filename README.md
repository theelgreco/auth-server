# Authentication Server

A production-ready, type-safe authentication microservice built with modern TypeScript best practices. This server demonstrates advanced architectural patterns, comprehensive error handling, and seamless integration capabilities for multi-service ecosystems.

## ✨ Key Features

### 🛡️ Security & Authentication
- **JWT Authentication**: Secure token-based authentication with HS256 algorithm
- **Password Security**: Industry-standard bcrypt hashing with configurable salt rounds
- **Google OAuth Integration**: Seamless third-party authentication via Google Sign-In
- **Multi-Service Architecture**: Isolated user authentication across multiple applications

### 🔍 Type Safety & Validation
- **End-to-End Type Safety**: Full TypeScript implementation with strict typing
- **Runtime Validation**: Zod schema validation for all request/response data
- **Contract-First Design**: Type-safe API contracts using ts-rest
- **Prisma ORM**: Type-safe database queries with generated client types
- **Custom Error Types**: Structured error handling with domain-specific error classes

### 🏗️ Architecture & Design
- **RESTful API Design**: Clean, resource-oriented endpoints
- **Middleware Pipeline**: Comprehensive error handling with specialized middleware
- **Database Abstraction**: Prisma ORM with PostgreSQL
- **Separation of Concerns**: Clean architecture with distinct layers (routes, models, middleware, utils)
- **Contract Distribution**: Publishable type-safe contracts via JSR

### 🚀 Developer Experience
- **Deno Runtime**: Modern JavaScript runtime with native TypeScript support
- **Hot Reload**: Development mode with automatic reloading
- **Migration Management**: Automated database migrations with Prisma
- **Environment Configuration**: Secure configuration via dotenv
- **CORS Support**: Cross-origin resource sharing enabled

## 📚 Technology Stack

### Core Technologies
- **Runtime**: [Deno](https://deno.land/) - Secure runtime for JavaScript and TypeScript
- **Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM

### Key Libraries
- **API Contracts**: [@ts-rest/core](https://ts-rest.com/) - RPC-like client with REST
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT implementation
- **Password Hashing**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Secure password hashing
- **CORS**: [cors](https://github.com/expressjs/cors) - Cross-origin resource sharing

## 🏛️ Architecture Overview

### API Contract Layer (`contracts/`)
```
contracts/
├── src/
│   ├── contract.ts      # API endpoint definitions
│   ├── validation.ts    # Zod schemas
│   ├── errors.ts        # Error types & classes
│   └── init.ts          # Contract initialization
└── dist/
    └── mod.ts           # Published contract module
```

The contract layer defines the API surface with full type safety, enabling:
- Type-safe client generation
- Automatic request/response validation
- Shared types between client and server
- Publishable as an independent package

### Application Layer (`src/`)
```
src/
├── app.ts               # Express application & routes
├── models/
│   └── models.ts        # Data access layer (Prisma)
├── lib/
│   ├── jwt.ts          # JWT generation
│   ├── utils.ts        # Password hashing/validation
│   └── middleware.ts   # Error handling middleware
└── db/
    └── connect.ts      # Database connection
```

### Database Schema (`prisma/`)
- **Users**: Email, username, password (hashed), service association
- **Services**: Multi-tenant service management
- **Unique Constraints**: Email/username uniqueness per service

## 📡 API Endpoints

### POST `/login`
Authenticate user with email/username and password.

**Request Body:**
```typescript
{
  emailOrUsername: string;
  password: string;
  serviceName: "ftp" | "income_calculator";
}
```

**Response:**
```typescript
{
  jwt: string; // 30-day expiration
}
```

### POST `/sign-up`
Register a new user account.

**Request Body:**
```typescript
{
  email: string;
  username: string;
  password: string; // min 8 characters
  serviceName: "ftp" | "income_calculator";
}
```

**Response:**
```typescript
{
  msg: "OK";
}
```

### POST `/google-sign-in`
Authenticate or register via Google OAuth.

**Request Body:**
```typescript
{
  token: string; // Google OAuth token
  serviceName: "ftp" | "income_calculator";
}
```

**Response:**
```typescript
{
  jwt: string;
}
```

## 🚦 Error Handling

The server implements a comprehensive error handling pipeline:

### Error Types
- **ValidationError** (400): Zod validation failures with detailed issues
- **PrismaClientKnownRequestError** (400/404): Database constraint violations
- **UnauthorisedError** (401): Authentication failures
- **ForbiddenError** (403): Authorization failures
- **InternalServerError** (500): Unexpected server errors

### Error Response Format
```typescript
{
  name: ErrorNameEnum;
  message?: string;
  issues?: ZodIssue[]; // For validation errors
}
```

## 🛠️ Setup & Installation

### Prerequisites
- [Deno](https://deno.land/) (latest version)
- PostgreSQL database

### Environment Configuration
Create a `.env` file:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
JWT_KEY="your-secret-key-here"
PORT=9091
```

### Installation & Running

```bash
# Generate Prisma client
deno task build

# Run database migrations
deno task migrate:dev

# Start development server
deno task dev

# Start production server
deno task start

# Compile standalone executable
deno task compile
```

## 📊 Development Highlights

### Type Safety
Every request and response is validated at runtime and compile time, ensuring:
- No runtime type mismatches
- Autocomplete in API clients
- Compile-time error detection
- Self-documenting API surface

### Error Handling Architecture
```typescript
// Middleware pipeline
app.use(errorLogger);           // Log all errors
app.use(handleZodValidationErrors);  // Handle validation
app.use(handlePrismaErrors);    // Handle database errors
app.use(handleCustomErrors);    // Handle business logic errors
app.use(handle500Errors);       // Catch-all handler
```

### Security Best Practices
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT with expiration (30 days)
- ✅ Environment-based secrets
- ✅ OAuth token verification
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Input validation on all endpoints

### Multi-Service Support
The architecture supports multiple client applications with isolated user spaces:
- Each service has unique user namespaces
- Prevents cross-service user conflicts
- Enables centralized authentication for microservices

### Contract Publishing
Contracts are publishable to JSR (JavaScript Registry):
```json
{
  "name": "@stelan/auth-contract",
  "version": "0.1.3",
  "exports": "./dist/mod.ts"
}
```

This enables client applications to import type-safe contracts:
```typescript
import authContract from "@stelan/auth-contract";
// Full type safety in client applications
```

## 🎯 Why This Project Demonstrates Strong Engineering

1. **Modern Tech Stack**: Leverages cutting-edge technologies (Deno, Prisma, ts-rest)
2. **Type Safety**: End-to-end type safety from database to API to client
3. **Clean Architecture**: Well-organized, maintainable codebase with clear separation
4. **Error Handling**: Comprehensive, user-friendly error responses
5. **Security First**: Industry-standard security practices implemented
6. **Scalable Design**: Multi-service architecture ready for growth
7. **Developer Experience**: Hot reload, migrations, type safety improve productivity
8. **Production Ready**: Proper logging, error handling, and environment configuration

## 📝 License

MIT

## 🤝 Contributing

This project showcases professional-grade authentication service implementation. Feel free to explore the code to see best practices in action!
