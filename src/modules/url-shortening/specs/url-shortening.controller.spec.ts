import { Test, TestingModule } from '@nestjs/testing';
import { UrlShorteningController } from '../url-shortening.controller';
import { UrlShorteningService } from '../url-shortening.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'abc123'),
}));

describe('UrlShorteningController', () => {
  let controller: UrlShorteningController;
  let urlService: jest.Mocked<UrlShorteningService>;

  const mockUrlService: jest.Mocked<UrlShorteningService> = {
    shortenUrl: jest.fn(),
    getOriginalUrl: jest.fn(),
  } as unknown as jest.Mocked<UrlShorteningService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShorteningController],
      providers: [
        {
          provide: UrlShorteningService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlShorteningController>(UrlShorteningController);
    urlService = module.get(UrlShorteningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /url', () => {
    it('should return shortened URL', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: 'https://example.com/long-url',
      };

      urlService.shortenUrl.mockResolvedValue('http://localhost/abc123');

      const result = await controller.createShortUrl(createUrlDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.shortenUrl).toHaveBeenCalledWith(createUrlDto);
      expect(result).toEqual({ shortUrl: 'http://localhost/abc123' });
    });

    it('should handle empty URL', async () => {
      const createUrlDto = { originalUrl: '' };
      urlService.shortenUrl.mockRejectedValue(new BadRequestException());

      await expect(
        controller.createShortUrl(createUrlDto as CreateUrlDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /resolve/:shortCode', () => {
    it('should return original URL', async () => {
      const shortCode = 'abc123';
      urlService.getOriginalUrl.mockResolvedValue('https://example.com');

      const result = await controller.getOriginalUrlJSON(shortCode);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      expect(result).toEqual({ originalUrl: 'https://example.com' });
    });

    it('should handle invalid short code', async () => {
      const shortCode = 'invalid';
      urlService.getOriginalUrl.mockRejectedValue(new BadRequestException());

      await expect(controller.getOriginalUrlJSON(shortCode)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to original URL', async () => {
      const shortCode = 'abc123';
      const mockRedirectUrl = 'https://example.com';
      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      urlService.getOriginalUrl.mockResolvedValue(mockRedirectUrl);

      await controller.redirectToOriginalUrl(shortCode, mockResponse);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.getOriginalUrl).toHaveBeenCalledWith(shortCode);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockResponse.redirect).toHaveBeenCalledWith(mockRedirectUrl);
    });

    it('should handle redirect errors', async () => {
      const shortCode = 'invalid';
      const mockResponse = { redirect: jest.fn() } as unknown as Response;
      urlService.getOriginalUrl.mockRejectedValue(new BadRequestException());

      await expect(
        controller.redirectToOriginalUrl(shortCode, mockResponse),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
