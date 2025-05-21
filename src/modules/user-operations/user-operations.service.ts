import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Url } from '../url-shortening/entities/url.entity';
import { UpdateUrlDto } from '../url-shortening/dto/update-url.dto';

@Injectable()
export class UserOperationsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async findAllUserUrls(userId: number) {
    const urls = await this.urlRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
      },
    });

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    return {
      urls,
      totalClicks,
    };
  }

  async updateUrl(id: string, userId: number, updateUrlDto: UpdateUrlDto) {
    if (!updateUrlDto || !updateUrlDto.originalUrl) {
      throw new BadRequestException(
        'The request body is missing or invalid. The "originalUrl" field is required.',
      );
    }

    const url = await this.urlRepository.findOne({
      where: {
        id,
        userId,
        deletedAt: IsNull(),
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found or does not belong to user');
    }

    url.originalUrl = updateUrlDto.originalUrl;

    return this.urlRepository.save(url);
  }

  async deleteUrl(id: string, userId: number) {
    const url = await this.urlRepository.findOne({
      where: {
        id,
        userId,
        deletedAt: IsNull(),
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found or does not belong to user');
    }

    url.deletedAt = new Date();

    return this.urlRepository.save(url);
  }
}
