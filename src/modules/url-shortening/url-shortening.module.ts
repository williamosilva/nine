import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShorteningService } from './url-shortening.service';
import { UrlShorteningController } from './url-shortening.controller';
import { Url } from './entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlShorteningController],
  providers: [UrlShorteningService],
  exports: [UrlShorteningService],
})
export class UrlShorteningModule {}
