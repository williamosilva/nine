# Changelog

## [0.3.3] - 2025-05-22

### 🚀 Deployment

**Heroku Integration**

- Added Procfile to define web process for Heroku deployment
- Configured production deployment pipeline

### 🐛 Bug Fixes

**Documentation Updates**

- Fixed repository clone command in README
- Updated logo image URL for better accessibility

### 📝 Documentation

**Setup Instructions**

- Enhanced installation guide with correct clone commands
- Improved database setup documentation
- Added deployment-ready configuration examples

---

## [0.3.2-RC] - 2023-10-21

### Documentation

📄 **README Overhaul**

- Added comprehensive project documentation
- Included API endpoint reference table

### Configuration

⚙️ **Environment Management**

- Standardized environment variables
- Added example .env file template

📦 **Package Management**

- Added engines requirement to package.json:

  ```json
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
  ```

---

## [0.3.1] - 2025-05-21

### Database

- **Schema Migrations**
  - Added `users` table with core authentication fields
  - Added `urls` table with relationship to users
  - UUID primary keys for URL entries
  - Foreign key constraint (`FK_urls_userId`)
  - Soft delete support via `deleted_at` column

### Infrastructure

- **TypeORM Configuration**
  - Added `DataSource` configuration for migrations
  - Environment-based database configuration
  - PostgreSQL SSL support
  - Migration file organization

### Changed

- **Database Schema**
  - Standardized timestamp columns (`created_at`, `updated_at`)
  - Added index for `short_code` uniqueness
  - Optimized user-URL relationship structure

### Security

- **Database Credentials**
  - Environment variable validation for DB connection
  - Sensitive field encryption guidelines added to docs

---

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

---

## [0.2.0] - 2025-05-21

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

---

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
