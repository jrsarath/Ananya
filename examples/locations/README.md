# Locations Module Example

This directory contains examples demonstrating the canonical implementation of the Locations module in Ananya.

## Overview

The Locations module implements a hierarchical storage system for inventory management. It allows creating and managing locations with parent-child relationships, which is essential for organizing physical inventory in a structured way.

## Core Concepts

### Location Entity

A `Location` represents a physical or logical location within the inventory system. Each location has:

- A unique identifier (`id`)
- A code that uniquely identifies the location
- A human-readable name
- A kind that categorizes the type of location (e.g., "warehouse", "shelf", "drawer")
- An optional parent location ID for hierarchical organization
- An active status flag
- Metadata for additional attributes

### Location Repository

The `LocationRepository` interface defines the contract for data access operations:

```typescript
interface LocationRepository {
  findById(id: string): Promise<Location | null>;
  findByCode(code: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  create(input: CreateLocationInput): Promise<Location>;
}
```

### Domain Errors

The module includes specific errors for handling business rule violations:

- `LocationCodeAlreadyExistsError`: Thrown when attempting to create a location with a code that already exists
- `ParentLocationNotFoundError`: Thrown when a parent location ID is specified but not found
- `InactiveParentLocationError`: Thrown when trying to create a location under an inactive parent
- `LocationNotFoundError`: Thrown when a location cannot be found

## Usage Example

```typescript
import { LocationService } from "./locations.service";
import { LocationRepository } from "./location.repository";

// Create a service instance with a repository implementation
const service = new LocationService(repository);

// Create a new location
const location = await service.create({
  code: "WH-001",
  name: "Warehouse Main Storage",
  kind: "warehouse",
  parentId: null,
});

// Find a location by ID
const foundLocation = await service.findById("location-id");
```

## Implementation Notes

The Locations module demonstrates the core principles of Ananya's architecture:

1. **Separation of Concerns**: Domain logic is separated from data access
2. **Type Safety**: Strong typing ensures correctness
3. **Error Handling**: Specific domain errors for clear error communication
4. **Repository Pattern**: Clean data access abstraction
5. **Immutability**: Location entities are immutable once created
