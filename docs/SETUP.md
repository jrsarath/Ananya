# Setup Guide

This document provides instructions for setting up the Ananya development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- pnpm (version 8 or higher)  
- Docker (for local database)
- PostgreSQL (for local development)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/48studios/ananya.git
cd ananya
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` to configure your development environment settings.

### 4. Database Setup
Start the database container:
```bash
docker-compose up -d
```

Run database migrations:
```bash
pnpm db:migrate
```

## Development Environment

### Running the Application
Start both API and web applications:
```bash
pnpm dev
```

Or start them separately:
```bash
# Start API server
pnpm api:dev

# Start Web application  
pnpm web:dev
```

### Testing
Run the test suite:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## Project Structure Overview

- `apps/api/` - NestJS API application
- `apps/web/` - Next.js web application  
- `packages/database/` - Database schema and persistence infrastructure
- `packages/inventory/` - Inventory domain logic
- `packages/shared/` - Shared contracts and utilities

## Useful Commands

### Development
- `pnpm dev` - Start development servers for both apps
- `pnpm api:dev` - Start API server only
- `pnpm web:dev` - Start web application only
- `pnpm test` - Run test suite
- `pnpm db:migrate` - Run database migrations

### Production
- `pnpm build` - Build production artifacts
- `pnpm start` - Start production servers
