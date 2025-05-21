import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { UrlShorteningService } from '../url-shortening.service';
import { Url } from '../entities/url.entity';
import { CreateUrlDto } from '../dto/create-url.dto';
import { REQUEST } from '@nestjs/core';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'abc123'),
}));

describe('UrlShorteningService', () => {
  let service: UrlShorteningService;

  const mockUrlRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShorteningService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BASE_URL') return 'http://localhost';
              return null;
            }),
          },
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = await module.resolve<UrlShorteningService>(UrlShorteningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should throw error if originalUrl is empty', async () => {
      const createUrlDto = { originalUrl: '' };

      await expect(
        service.shortenUrl(createUrlDto as CreateUrlDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and return shortened URL', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: 'https://example.com/long-url',
      };

      const mockUrl = {
        originalUrl: createUrlDto.originalUrl,
        shortCode: 'abc123',
        user: mockRequest.user,
      };

      mockUrlRepository.create.mockReturnValue(mockUrl);
      mockUrlRepository.save.mockResolvedValue(mockUrl);

      const result = await service.shortenUrl(createUrlDto);

      expect(nanoid).toHaveBeenCalledWith(6);

      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        originalUrl: createUrlDto.originalUrl.trim(),
        shortCode: 'abc123',
        user: mockRequest.user,
      });
      expect(mockUrlRepository.save).toHaveBeenCalledWith(mockUrl);
      expect(result).toBe('http://localhost/abc123');
    });

    it('should trim whitespace from originalUrl', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: '  https://example.com/long-url  ',
      };

      const mockUrl = {
        originalUrl: createUrlDto.originalUrl.trim(),
        shortCode: 'abc123',
        user: mockRequest.user,
      };

      mockUrlRepository.create.mockReturnValue(mockUrl);
      mockUrlRepository.save.mockResolvedValue(mockUrl);

      await service.shortenUrl(createUrlDto);

      expect(mockUrlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalUrl: 'https://example.com/long-url',
        }),
      );
    });
  });

  describe('getOriginalUrl', () => {
    it('should throw error if short code not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.getOriginalUrl('invalidCode')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return original URL and increment clicks', async () => {
      const mockUrl = {
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        clicks: 0,
      };

      mockUrlRepository.findOne.mockResolvedValue(mockUrl);
      mockUrlRepository.save.mockResolvedValue(mockUrl);

      const result = await service.getOriginalUrl('abc123');

      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode: 'abc123' },
      });
      expect(mockUrl.clicks).toBe(1);
      expect(mockUrlRepository.save).toHaveBeenCalledWith(mockUrl);
      expect(result).toBe('https://example.com');
    });
  });
});
