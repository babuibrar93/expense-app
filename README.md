# Expense Management API

## Overview

This is an Expense Management API built using NestJS, TypeORM, and MSSQL. It includes authentication, user management, and role-based access control (RBAC).

## Features

- User authentication (JWT)
- Role-based access control (RBAC)
- Organization and group management
- Expense tracking
- Database migrations
- REST API documentation with Swagger

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and configure the required settings:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=1433
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=expense_db
   JWT_SECRET_KEY=your_secret_key
   ```

4. Run the database migrations:

   ```sh
   npm run migration:run
   ```

5. Start the application:
   ```sh
   npm run start:dev
   ```

## Project Structure

```
src/
├── auth/                            # Authentication Module (Login, Signup, JWT, etc.)
│   ├── dto/                         # Data Transfer Objects (DTOs) for request validation
│   ├── interfaces/                  # Interfaces for services and repository patterns
│   ├── jobs/                        # Workers for background tasks (e.g., email verification)
│   ├── auth.service.ts              # Service layer (Business logic for authentication)
│   ├── auth.controller.ts           # Handles HTTP requests (API endpoints)
│   ├── auth.module.ts               # NestJS module definition
│
├── user/                            # User Module (Profile, Roles, etc.)
│   ├── dto/                         # User-related DTOs (e.g., update profile)
│   ├── interfaces/                  # User-related interfaces for strong typing
│   ├── user.service.ts              # Business logic for user management
│   ├── user.controller.ts           # API routes for user management
│   ├── user.module.ts               # NestJS module for users
│
├── common/                          # Common utilities and cross-cutting concerns
│   ├── filters/                     # Global exception filters (e.g., HttpExceptionFilter)
│   ├── interceptors/                # Logging, performance, and transformation interceptors
│   ├── decorators/                  # Custom decorators (e.g., @CurrentUser)
│   ├── guards/                      # Authentication & authorization guards (e.g., JWT, Roles)
│   ├── pipes/                       # Validation and transformation pipes
│   ├── utils/                       # Helper functions (e.g., hashing, formatting)
│   ├── dto/                         # Global DTOs
│   ├── constants/                   # Global constants
│   ├── factories/                   # Factory functions for dependency injection
│   ├── repositories/                # Base repositories and repository factories
│   ├── types/                       # Type definitions and interfaces used across modules and enums
│
├── core/                            # Core application setup and infrastructure
│   ├── config/                      # Configuration files (e.g., dotenv, app settings)
│   ├── database/                    # All database-related files
│   │   ├── entities/                # Database entities (TypeORM models)
│   │   │   ├── user.entity.ts       # User entity definition
│   │   │   ├── auth.entity.ts       # Auth-related entity
│   │   │   ├── order.entity.ts      # Order entity
│   │   │   ├── index.ts             # Export all entities from here
│   │   ├── migrations/              # Database migration files
│   │   │   ├── 001-init.ts          # Initial database migration
│   │   ├── seeders/                 # Database seeders for populating data
│   │   │   ├── user.seeder.ts       # Seeder for initial user data
│   │   │   ├── order.seeder.ts      # Seeder for order data
│   │   ├── typeorm.config.ts        # TypeORM database configuration
│   │   ├── index.ts                 # Centralized database exports
│
├── main.ts                          # Main entry point of the application
```

## API Documentation

Swagger documentation is available at `/api/docs` when the server is running.

## License

MIT License
