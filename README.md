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
- **Follows NestJS Best Practices**
  - Plural naming for modules, singular for services, entities, and repositories.
  - Organized folder structure for maintainability and scalability.
  - DTOs, interfaces, and repositories are used for strong typing and separation of concerns.
  
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
│   ├── dtos/                         # Data Transfer Objects (DTOs) for request validation
│   ├── interfaces/                  # Interfaces for services and repository patterns
│   ├── auth.service.ts              # Service layer (Business logic for authentication)
│   ├── auth.controller.ts           # Handles HTTP requests (API endpoints)
│   ├── auth.module.ts               # NestJS module definition (Plural Naming Convention)
│
├── users/                           # User Module (Plural Folder Name)
│   ├── dtos/                         # User-related DTOs (Singular File Names)
│   ├── interfaces/                  # User-related interfaces for strong typing
│   ├── user.service.ts              # Business logic for user management (Singular)
│   ├── users.controller.ts           # API routes for user management (Singular)
│   ├── users.module.ts              # NestJS module for users (Plural)
│
├── common/                          # Common utilities and cross-cutting concerns
│   ├── filters/                     # Global exception filters (e.g., HttpExceptionFilter)
│   ├── interceptors/                # Logging, performance, and transformation interceptors
│   ├── decorators/                  # Custom decorators (e.g., @CurrentUser)
│   ├── guards/                      # Authentication & authorization guards (e.g., JWT, Roles)
│   ├── pipes/                       # Validation and transformation pipes
│   ├── utils/                       # Helper functions (e.g., hashing, formatting)
│   ├── dto/                         # Global DTOs (Plural Folder Name)
│   ├── constants/                   # Global constants
│   ├── factories/                   # Factory functions for dependency injection
│   ├── repositories/                # Base repositories and repository factories
│   ├── types/                       # Type definitions and interfaces used across modules and enums
│
├── core/                            # Core application setup and infrastructure
│   ├── config/                      # Configuration files (e.g., dotenv, app settings)
│   ├── database/                    # All database-related files
│   │   ├── entities/                # Database entities (Plural Folder, Singular File Names)
│   │   │   ├── user.entity.ts       # User entity definition (Singular)
│   │   │   ├── auth.entity.ts       # Auth-related entity
│   │   │   ├── expense.entity.ts    # Expense entity
│   │   │   ├── index.ts             # Export all entities from here
│   │   ├── migrations/              # Database migration files (Plural Naming Convention)
│   │   │   ├── 001-init.ts          # Initial database migration
│   │   ├── seeders/                 # Database seeders for populating data (Plural)
│   │   │   ├── user.seeder.ts       # Seeder for initial user data (Singular File Name)
│   │   │   ├── expense.seeder.ts    # Seeder for expense data (Singular File Name)
│   │   ├── typeorm.config.ts        # TypeORM database configuration
│   │   ├── index.ts                 # Centralized database exports
│
├── main.ts                          # Main entry point of the application
```

## API Documentation

Swagger documentation is available at `/api/docs` when the server is running.

## NestJS Best Practices Implemented

✅ **Plural Folders & Singular Files** – Ensures maintainability & readability.  
✅ **Separation of Concerns** – Uses DTOs, interfaces, repositories, services, and controllers separately.  
✅ **Modular Architecture** – Each feature is encapsulated within its module.  
✅ **Type Safety** – Strong typing with TypeScript, interfaces, and DTO validation.  
✅ **Error Handling** – Uses exception filters and global interceptors.  
✅ **Configuration Management** – Uses a `config` directory for centralized settings.  
✅ **Security Best Practices** – Follows NestJS authentication and RBAC practices.  

## License

MIT License
