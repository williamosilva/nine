import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOperationsController } from './user-operations.controller';
import { UserOperationsService } from './user-operations.service';
import { Url } from '../url-shortening/entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UserOperationsController],
  providers: [UserOperationsService],
  exports: [UserOperationsService],
})
export class UserOperationsModule {}
