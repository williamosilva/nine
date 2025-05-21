# Changelog

## [0.2.0] - 2025-05-22

### Added

- **URL Shortening Module**
  - URL shortening service with 6-character code generation (nanoid)
  - Click tracking and statistics system
  - User ownership association for authenticated requests
  - Request-scoped service for security isolation
  - URL entity with TypeORM relations

### Changed

- **Enhanced Authentication System**
  - Custom `JwtAuthGuard`
  - `JwtUserExtractor` middleware for user context injection
  - Improved token validation flow with detailed logging
  - Better error handling for malformed JWTs

### Security

- Request context isolation for sensitive operations
- Enhanced token extraction validation
- Security logging for auth failures

### Documentation

- Extended Swagger annotations for auth/URL endpoints
