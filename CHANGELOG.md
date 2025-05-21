# Changelog

## [0.1.0] - 2025-05-21

### Added

- **Authentication Module**

  - Login and registration system with email validation
  - JWT-based authentication with access and refresh tokens
  - Refresh token rotation and security hashing (bcrypt)
  - Protected endpoints using `JwtAuthGuard`
  - Custom decorators (`@GetUser`) for user context injection

- **Key Features**

  - Endpoints:
    - `POST /auth/login` (User login)
    - `POST /auth/register` (User registration)
    - `POST /auth/refresh` (Token refresh)
    - `POST /auth/logout` (Session termination)
  - Error handling for:
    - Duplicate email registration (`ConflictException`)
    - Invalid credentials (`UnauthorizedException`)
    - Token validation failures (`ForbiddenException`)

- **Security**

  - Password hashing with salt generation
  - Environment variable configuration for secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
  - Token expiration policies

- **Documentation**

  - Integrated Swagger (OpenAPI) documentation with example payloads
  - API tags and bearer auth configuration

- **Dependencies**
  - `@nestjs/jwt` for token management
  - `bcrypt` for password hashing
  - TypeORM integration for user operations
