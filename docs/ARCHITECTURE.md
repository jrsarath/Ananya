# Ananya Architecture

## Overview

Ananya is the operations system for 48 Studios.

The system is developed as a modular monorepo.

## Technology Stack

- pnpm
- Turborepo
- TypeScript
- Next.js
- NestJS
- PostgreSQL
- Drizzle ORM
- Zod

## Repository Structure

apps/
api/ NestJS API
web/ Next.js web application

packages/
database/ Database schema and persistence infrastructure
inventory/ Inventory domain logic
shared/ Shared contracts and utilities

## Architectural Direction

Ananya is a modular monolith.

Do not introduce microservices unless an operational requirement
demonstrates a clear need.

Modules should maintain explicit domain boundaries.

## Dependency Direction

Web
↓
API

API
↓
Domain Modules

Domain Modules
↓
Infrastructure

## Core Principles

### Clean Architecture
The system follows Clean Architecture principles with clear separation of concerns:
- Domain layer (inventory) contains business logic
- Application layer (API) orchestrates use cases
- Infrastructure layer (database) handles persistence
- Presentation layer (web) provides user interface

### Repository Pattern
All data access is abstracted through repository interfaces to ensure loose coupling and testability.

### Dependency Injection
NestJS dependency injection is used throughout the API layer to manage dependencies.

### Domain Driven Design
Lightweight DDD practices are applied with clear domain boundaries, value objects, and entities.

## Modules

### Inventory Module
The inventory module is the core domain of Ananya. It handles:
- Stock tracking and management
- Location-based storage
- Inventory transactions
- Item categorization and metadata

### API Layer
The API layer provides RESTful endpoints for:
- Inventory operations
- Location management
- User authentication and authorization
- Data validation using Zod schemas

### Web Layer
The web layer provides a user interface for:
- Inventory search and discovery
- Stock management
- Location visualization
- Operational workflows

## Data Flow

1. Web application makes requests to API endpoints
2. API validates requests using Zod schemas
3. API orchestrates domain services
4. Domain services interact with repositories
5. Repositories handle database operations via Drizzle ORM
6. Database stores and retrieves data using PostgreSQL

## Security Considerations

- All API endpoints are protected by authentication
- Role-based access control is implemented
- Data validation occurs at multiple layers
- Sensitive information is encrypted in transit and at rest