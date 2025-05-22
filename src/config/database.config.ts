import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Url } from '../modules/url-shortening/entities/url.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: Number(configService.get('DB_PORT', 5432)),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'mydb'),
  entities: [User, Url],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
  logging: configService.get('DB_LOGGING') === 'true',
  ssl:
    configService.get('DB_SSL') === 'true'
      ? { rejectUnauthorized: false }
      : false,
});
