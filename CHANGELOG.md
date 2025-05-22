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
