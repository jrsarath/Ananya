# API Guidelines

This document outlines the standards and practices for designing and implementing APIs within Ananya.

## Overview

The Ananya API follows RESTful principles with a focus on clarity, consistency, and security. All interactions with the system must go through this API layer.

## Design Principles

### Consistency
- Maintain consistent naming conventions across all endpoints
- Use similar response patterns for similar operations
- Follow established HTTP status code usage
- Keep parameter naming consistent

### Clarity
- Use descriptive endpoint names that clearly indicate their purpose
- Provide clear documentation for all endpoints
- Include examples in API documentation
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)

### Security
- All API endpoints require proper authentication
- Sensitive data should be protected and not exposed unnecessarily
- Implement rate limiting to prevent abuse
- Validate all input parameters thoroughly

## Endpoint Structure

### Resource Naming
- Use plural nouns for resource names (e.g., `/inventory/items`, `/locations`)
- Use hyphens for compound words in endpoints (e.g., `/inventory/transaction-history`)
- Keep endpoint paths shallow and logical

### HTTP Methods
- `GET` - Retrieve resources or collections
- `POST` - Create new resources
- `PUT` - Update entire resources
- `PATCH` - Partially update resources
- `DELETE` - Remove resources

### Status Codes
- 200 OK - Successful GET, PUT, PATCH, DELETE
- 201 Created - Successful POST
- 400 Bad Request - Invalid request data
- 401 Unauthorized - Authentication required
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

## Request and Response Format

### Request Headers
- `Content-Type: application/json` for JSON requests
- `Authorization: Bearer <token>` for authenticated requests
- Include appropriate caching headers where relevant

### Response Structure
All API responses should follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message",
  "errors": []
}
```

For error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message"
    }
  ]
}
```

## Authentication and Authorization

### Authentication
- All API endpoints require authentication using JWT tokens
- Tokens are obtained via the `/auth/login` endpoint
- Tokens should be included in the `Authorization` header for all requests

### Authorization
- Implement role-based access control (RBAC)
- Verify permissions at the endpoint level
- Restrict sensitive operations to authorized users only

## Versioning

API versioning is handled through URL paths:
```
/v1/inventory/items
/v2/inventory/items
```

## Rate Limiting

Implement rate limiting to prevent abuse:
- 100 requests per minute for unauthenticated endpoints  
- 1000 requests per minute for authenticated endpoints
- Return appropriate `X-RateLimit-*` headers in responses

## Validation

### Input Validation
- Validate all input parameters on the API boundary
- Use Zod schemas for request validation
- Provide clear error messages for validation failures

### Output Validation  
- Ensure API responses conform to expected schemas
- Include comprehensive response validation where appropriate
