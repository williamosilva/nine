<div align="center">
  <img src="https://i.imgur.com/KAsRGKn.png" alt="Nine Logo" width="200"/>

  <h1>Nine</h1>

  <p>A robust URL shortener REST API built with <a href="https://nestjs.com">NestJS</a></p>

  <p>
    <a href="https://nine-05117fcebc0d.herokuapp.com/api" target="_blank">
      <img src="https://img.shields.io/badge/🚀%20Deploy-Heroku-purple?style=for-the-badge" alt="Deploy on Heroku"/>
    </a>
  </p>
</div>

## Description

Nine is a full-featured URL shortener service that allows users to register, authenticate, and manage their shortened URLs. The application provides secure user authentication using JWT tokens, URL shortening with custom short codes, and complete CRUD operations for URL management.

## Key Features

- **User Authentication**: Complete registration and login system with JWT tokens
- **URL Shortening**: Convert long URLs into short, manageable codes
- **User Dashboard**: Users can view, update, and delete their URLs
- **Secure**: JWT-based authentication with refresh token support
- **API Documentation**: Interactive Swagger documentation
- **Database**: PostgreSQL with TypeORM
- **Testing**: Test suite with Jest
- **Code Quality**: ESLint, Prettier, and Husky for code consistency

## Tech Stack

### Development Tools

- **Jest**: Testing framework with coverage reports
- **Husky**: Git hooks for automated code quality checks
- **ESLint**: Code linting and error detection
- **Prettier**: Code formatting
- **Lint-staged**: Run linters on staged git files
- **Docker**: Containerization for consistent development environment

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user and return tokens
- `POST /auth/login` - Authenticate user and return access and refresh tokens
- `POST /auth/logout` - Logout the current user and invalidate refresh token
- `POST /auth/refresh` - Use a refresh token to get new access and refresh tokens

### URL Operations

- `POST /url` - Shorten a URL
- `GET /{shortCode}` - Redirect to the original URL using the shortcode
- `GET /resolve/{shortCode}` - Get original URL (without redirect for swagger testing)

### User Operations

- `GET /user-operations/urls` - List all URLs of the authenticated user
- `PATCH /user-operations/urls/{id}` - Update an authenticated user's URL
- `DELETE /user-operations/urls/{id}` - Delete an authenticated user's URL

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Node.js (see Node.js Version Requirements below)
- PostgreSQL (if running without Docker)

### Node.js Version Requirements

This project requires Node.js version **18.x** or higher. We recommend using the latest LTS version for optimal performance and security.

**Supported versions:**

- Node.js 18.x (minimum required)
- Node.js 20.x (recommended LTS)
- Node.js 22.x (latest supported)

**Version enforcement:**
The project uses the `engines` field in `package.json` to enforce Node.js version requirements:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/williamosilva/nine
cd nine
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST='postgres' or 'localhost' for local enviroment
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mydb
DB_SYNCHRONIZE=true
DB_LOGGING=false
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

### Running with Docker (Recommended)

1. **Start the application with Docker Compose:**

```bash
docker-compose up -d
```

This will start:

- **Nine API**: Available at `http://localhost:3000`
- **PostgreSQL Database**: Available at `localhost:5432`
- **PgAdmin**: Available at `http://localhost:5050` (admin@admin.com / admin)

The application will automatically create the database tables using TypeORM's synchronize feature when it starts.

2. **View application logs:**

```bash
docker-compose logs -f nine
```

3. **Stop the application:**

```bash
docker-compose down
```

### Running Locally (Without Docker)

**Important**: Before running the application locally, you must manually create the PostgreSQL database (Following the instructions in your .env)

1. **Install dependencies:**

```bash
npm install
```

2. **Create the PostgreSQL database manually:**

   Connect to your PostgreSQL instance and create the database:

   ```sql
   -- Connect to PostgreSQL (using psql or any PostgreSQL client)
   psql -U postgres -h localhost

   -- Create the database
   CREATE DATABASE auth_db;

   -- Verify the database was created
   \l
   ```

   Or using command line:

   ```bash
   # Create database using createdb command
   createdb -U postgres -h localhost auth_db
   ```

3. **Start the development server:**

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

The database tables will be automatically created by TypeORM when the application starts, so no manual migration is needed for basic setup.

## Database Migrations (Optional)

The application uses TypeORM with synchronize enabled, which automatically creates and updates database tables when the application starts. **You don't need to run migrations for basic setup.**

However, if you want to manage database schema changes manually using migrations instead of automatic synchronization, you can use the following commands:

**Important**: Before running migrations, make sure the PostgreSQL database exists. If running migrations locally, you must create the database manually as described in the "Running Locally" section above.

### Run pending migrations:

```bash
npm run migration:run
```

### Revert last migration:

```bash
npm run migration:revert
```

### Show migration status:

```bash
npm run migration:show
```

**Note**: If you choose to use migrations, make sure to set `DB_SYNCHRONIZE=false` in your environment variables to prevent automatic schema synchronization.

## Testing

### Run all tests:

```bash
npm run test
```

### Run tests in watch mode:

```bash
npm run test:watch
```

### Run tests with coverage:

```bash
npm run test:cov
```

## Development

### Code Quality

The project uses several tools to maintain code quality:

- **ESLint**: Linting is automatically run on pre-commit via Husky
- **Prettier**: Code formatting is applied automatically
- **Husky**: Git hooks ensure code quality before commits
- **Lint-staged**: Only staged files are linted and formatted

### Git Hooks (Husky)

The project uses Husky to run automated checks on git commits:

**Pre-commit hook** - Runs linting and formatting on staged files:

```bash
npx lint-staged
```

**Pre-push hook** - Runs tests before pushing to ensure code quality:

```bash
npm test
```

These hooks ensure that all committed code follows the project's coding standards and passes tests.

### CI/CD

The project is configured to work with GitHub Actions for continuous integration, running automated tests, linting, and code quality checks on every push and pull request to ensure code integrity.

## API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

```
http://localhost:3000/api
```

This provides a complete interface to test all endpoints and view detailed API specifications.

## Docker Services

The application uses a multi-service Docker setup:

- **nine**: Main NestJS application
- **postgres**: PostgreSQL database
- **pgadmin**: Database administration interface

All services are connected via a custom Docker network for secure communication.

## Horizontal Scaling Considerations

### Improvement Points for Horizontal Scaling

1. **Database Optimization**

   - Implement database read replicas for load distribution
   - Add connection pooling (e.g., PgBouncer)
   - Consider sharding for URL data storage

2. **Caching Layer**

   - Add Redis cache for frequent URL lookups
   - Implement JWT token revocation list cache
   - Cache popular URLs to reduce database load

3. **Stateless Architecture**

   - Centralize session storage for JWT refresh tokens
   - Use distributed cache for rate limiting counters

4. **Load Balancing**

   - Add health check endpoints for load balancers
   - Consider cloud-native solutions (AWS ALB, GCP Load Balancer)

5. **Asynchronous Processing**

   - Add message queue (RabbitMQ/Kafka) for:
     - Analytics processing
     - Notification system

6. **Security Scaling**
   - Implement global rate limiting
   - Add DDoS protection layer
   - Centralized secret management (Vault/AWS Secrets Manager)

### Main Scaling Challenges

1. **Data Consistency**

   - Maintaining URL consistency across multiple database instances
   - Cache invalidation strategies for URL updates/deletions

2. **State Management**

   - Handling refresh token revocation in distributed systems
   - Managing concurrent URL updates across instances

3. **Performance Bottlenecks**

   - Hotspot URLs creating uneven load distribution
   - Database write contention for popular short codes

4. **Operational Complexity**

   - Managing zero-downtime deployments
   - Coordinated schema migrations
   - Cross-service tracing and debugging

5. **Geographical Distribution**

   - Maintaining low latency for global users
   - Data residency compliance challenges

6. **Cost Management**
   - Predicting and optimizing cloud infrastructure costs
   - Auto-scaling strategy optimization
