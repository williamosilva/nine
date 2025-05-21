import { Injectable, Inject, Scope, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from '../users/entities/user.entity';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class UrlShorteningService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @Inject(REQUEST) private readonly request: Request & { user?: User },
    private readonly configService: ConfigService,
  ) {}

  async shortenUrl(createUrlDto: CreateUrlDto): Promise<string> {
    if (!createUrlDto.originalUrl || createUrlDto.originalUrl.trim() === '') {
      throw new BadRequestException('Original URL cannot be empty');
    }

    const shortCode = nanoid(6);
    const user = this.request.user;

    const url = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl.trim(),
      shortCode,
      user,
    });

    await this.urlRepository.save(url);

    const baseUrl = this.configService.get<string>('BASE_URL');
    return `${baseUrl}/${shortCode}`;
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) throw new BadRequestException('URL not found');

    url.clicks++;
    await this.urlRepository.save(url);

    return url.originalUrl;
  }
}
