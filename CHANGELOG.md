# Changelog

## [0.3.0] - 2025-05-21

### Added

- **User Operations Module**

  - Complete CRUD operations for user-owned URLs
  - Soft delete system with `deletedAt` field
  - Owner validation for URL modifications
  - Total clicks aggregation per user
  - Custom request interface with user typing

- **Key Features**
  - Endpoints:
    - `GET /user-operations/urls` (List user URLs + statistics)
    - `PATCH /user-operations/urls/:id` (Update URL destination)
    - `DELETE /user-operations/urls/:id` (Soft delete URL)
  - Business Rules:
    - Prevention of operations on deleted URLs
    - Strict user ownership validation
    - Request body validation for updates

### Security

- Ownership verification middleware
- Protection against IDOR vulnerabilities
- Sensitive operations require fresh JWT

### Documentation

- Detailed Swagger annotations for user operations:
  - Response schemas with click statistics
  - Error examples for invalid operations
  - Authentication requirements
  - Response status codes documentation

### Testing

- E2E tests for user operations flow
- Unit tests for business logic:
  - Soft delete validation
  - Ownership checks
  - Update payload validation
  - Statistics calculation
