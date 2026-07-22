# API

This document describes the principles used when designing the Ananya API.

## Purpose

The API is the only supported interface for interacting with the Ananya domain.

Current and future clients include:

- Web application
- Mobile applications
- CLI tools
- Internal automation
- AI assistants
- Barcode scanners

Clients should never implement business rules independently.

---

## Architecture

The API is implemented using NestJS.

Responsibilities of the API layer include:

- Expose HTTP endpoints
- Validate request data
- Invoke domain use cases
- Translate domain errors into HTTP responses

Business rules belong in the domain packages, not in controllers.

---

## Design Principles

### Resource-Oriented

Endpoints should represent domain resources.

Examples:

```
/locations
/components
/manufacturers
```

---

### Thin Controllers

Controllers should:

- receive requests
- validate DTOs
- call services
- return responses

Controllers should not contain business logic.

---

### Service Layer

Services orchestrate domain use cases.

Services may:

- load dependencies
- invoke repositories
- coordinate workflows

Services should not duplicate domain validation.

---

### Validation

Request validation is performed at the API boundary using:

- class-validator
- ValidationPipe

Business validation belongs to the domain layer.

---

## Error Handling

Domain errors should be translated into appropriate HTTP responses.

The API layer is responsible for mapping technical protocols, not business rules.

---

## Future Evolution

As the API grows, this document will expand to cover:

- authentication
- authorization
- pagination
- filtering
- API versioning
- OpenAPI documentation

These topics will be documented when implemented.
