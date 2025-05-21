import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Nine URL Shortener API')
    .setDescription(
      `RESTful API for URL shortening, user management and click tracking.
       
## Features

- User registration and authentication
- URL shortening (with or without authentication)
- Authenticated users can manage their own URLs
- Access counting for each shortened URL
- Soft deletes with timestamp

> Shortened URLs are limited to 6 characters. Authenticated users have URLs tied to their account.

Endpoints that require authentication use a Bearer token.

All timestamps follow ISO 8601 format.`,
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'User authentication and registration')
    .addTag('Url', 'Shorten, update, delete, list and redirect URLs')
    .addTag('User Operations', 'User operations for managing URLs')

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
