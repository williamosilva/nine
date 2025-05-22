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

## [0.3.2-RC] - 2023-10-22

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

  ***

  # Changelog

## [0.3.1] - 2025-05-23

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
