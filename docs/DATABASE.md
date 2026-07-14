# Database Design

This document describes the database schema and patterns used in Ananya.

## Overview

Ananya uses PostgreSQL as its primary database with Drizzle ORM for type-safe database operations. The database design follows relational principles to support operational entities and ledgers while maintaining data integrity.

## Schema Principles

### Relational Structures
- Use normalized relational structures for operational entities
- Maintain clear relationships between tables
- Use foreign key constraints to enforce referential integrity
- Design for the inventory ledger as the source of truth

### JSONB Usage
- Use JSONB columns for category-specific item specifications
- Store variant configurations and custom attributes in JSONB fields
- Ensure JSONB schemas are well-documented
- Validate JSONB content where appropriate

## Core Tables

### Inventory Ledger
The inventory ledger is the source of truth for all stock movements:

```sql
CREATE TABLE inventory_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type VARCHAR(20) NOT NULL,
  item_id UUID NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL,
  source_location_id UUID,
  destination_location_id UUID,
  reference_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL
);
```

### Items
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL,
  specifications JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Locations
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  parent_location_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Transaction Types

Supported inventory transaction concepts:

- **OPENING** - Initial stock setup
- **RECEIVE** - Stock received from supplier or production
- **MOVE** - Stock moved between locations (cannot create or destroy stock)
- **CONSUME** - Stock consumed in production or assembly
- **ADJUST** - Manual adjustment of inventory levels
- **RETURN** - Stock returned to supplier or storage
- **SCRAP** - Stock scrapped or written off
- **REVERSAL** - Reversal of previous transactions

## Database Constraints

### Immutability
- All transactions are immutable
- Corrections use reversal transactions rather than direct modifications
- Transaction history is preserved indefinitely

### Business Rules
- MOVE cannot create or destroy stock (quantity must remain constant)
- RECEIVE has no source location
- CONSUME has no destination location
- Source and destination locations cannot be identical
- Stock cannot become negative unless explicitly supported by future policy

### Atomicity
- All stock mutations execute inside database transactions
- Database constraints enforce domain invariants where practical
- Inventory balances must be reproducible from the ledger

## Migration Strategy

### Versioning
- Database schema changes are versioned through migration scripts
- Migrations follow a sequential numbering system
- Each migration script is idempotent and safe to run multiple times

### Backward Compatibility
- Maintain backward compatibility in API contracts
- Ensure migrations can be rolled back safely when needed
- Document breaking changes clearly

## Performance Considerations

### Indexing
- Create appropriate indexes on frequently queried columns
- Use composite indexes for multi-column searches
- Monitor query performance regularly

### Query Patterns
- Optimize queries for inventory ledger operations
- Use connection pooling for database access
- Implement caching strategies where appropriate

## Security

### Access Control
- Database users should have minimal required privileges
- Implement row-level security where applicable
- Audit database access and modifications
