import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/modules/users/entities/user.entity';
import { Url } from './src/modules/url-shortening/entities/url.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: Number(configService.get('DB_PORT', 5432)),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'auth_db'),
  entities: [User, Url],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  ssl:
    configService.get('DB_SSL') === 'true'
      ? { rejectUnauthorized: false }
      : false,
});
