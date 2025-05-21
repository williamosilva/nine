import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserOperationsService } from '../user-operations.service';
import { Url } from '../../../modules/url-shortening/entities/url.entity';
import { UpdateUrlDto } from '../../../modules/url-shortening/dto/update-url.dto';

describe('UserOperationsService', () => {
  let service: UserOperationsService;

  const mockUrlRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  } as unknown as jest.Mocked<Repository<Url>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOperationsService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UserOperationsService>(UserOperationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUserUrls', () => {
    it('should return all user URLs and total clicks', async () => {
      const mockUrls = [
        { id: '1', originalUrl: 'http://test1.com', clicks: 5 },
        { id: '2', originalUrl: 'http://test2.com', clicks: 10 },
      ] as Url[];

      mockUrlRepository.find.mockResolvedValue(mockUrls);

      const result = await service.findAllUserUrls(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUrlRepository.find).toHaveBeenCalledWith({
        where: {
          userId: 1,
          deletedAt: IsNull(),
        },
      });
      expect(result.urls).toEqual(mockUrls);
      expect(result.totalClicks).toBe(15);
    });
  });

  describe('updateUrl', () => {
    const updateDto: UpdateUrlDto = { originalUrl: 'http://updated.com' };

    it('should throw error if originalUrl is not provided', async () => {
      await expect(
        service.updateUrl('1', 1, {} as UpdateUrlDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if URL not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUrl('1', 1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the URL correctly', async () => {
      const mockUrl = {
        id: '1',
        originalUrl: 'http://original.com',
        userId: 1,
      } as Url;

      mockUrlRepository.findOne.mockResolvedValue(mockUrl);
      mockUrlRepository.save.mockResolvedValue({ ...mockUrl, ...updateDto });

      const result = await service.updateUrl('1', 1, updateDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: 1,
          deletedAt: IsNull(),
        },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUrlRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ originalUrl: 'http://updated.com' }),
      );
      expect(result.originalUrl).toBe('http://updated.com');
    });
  });

  describe('deleteUrl', () => {
    it('should throw error if URL not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUrl('1', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('must mark the URL as deleted', async () => {
      const mockUrl = {
        id: '1',
        userId: 1,
        deletedAt: null,
        originalUrl: 'http://test.com',
        shortCode: 'abc123',
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Url;

      mockUrlRepository.findOne.mockResolvedValue(mockUrl);

      mockUrlRepository.save.mockImplementation((url) =>
        Promise.resolve(Object.assign(new Url(), url)),
      );

      const result = await service.deleteUrl('1', 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: 1,
          deletedAt: IsNull(),
        },
      });
      expect(result.deletedAt).toBeInstanceOf(Date);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUrlRepository.save).toHaveBeenCalled();
    });
  });
});
