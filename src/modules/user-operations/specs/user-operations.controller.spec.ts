import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserOperationsController } from '../user-operations.controller';
import { UserOperationsService } from '../user-operations.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateUrlDto } from '../../../modules/url-shortening/dto/update-url.dto';
import { RequestWithUser } from '../interfaces/request-with-user';

describe('UserOperationsController', () => {
  let controller: UserOperationsController;

  const mockUserOperationsService = {
    findAllUserUrls: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
  };

  const mockRequest: RequestWithUser = {
    user: {
      id: 1,
      email: 'test@example.com',
    },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOperationsController],
      providers: [
        {
          provide: UserOperationsService,
          useValue: mockUserOperationsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<UserOperationsController>(UserOperationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /user-operations/urls', () => {
    it('should return the users URLs with total clicks', async () => {
      const mockResult = {
        urls: [
          {
            id: '1',
            originalUrl: 'http://test.com',
            shortCode: 'abc123',
            clicks: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalClicks: 5,
      };

      mockUserOperationsService.findAllUserUrls.mockResolvedValue(mockResult);

      const result = await controller.findAllUserUrls(mockRequest);

      expect(mockUserOperationsService.findAllUserUrls).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('PATCH /user-operations/urls/:id', () => {
    const updateDto: UpdateUrlDto = { originalUrl: 'http://updated.com' };

    it('must update a URL successfully', async () => {
      const mockUrl = {
        id: '1',
        originalUrl: 'http://updated.com',
      };

      mockUserOperationsService.updateUrl.mockResolvedValue(mockUrl);

      const result = await controller.updateUrl('1', updateDto, mockRequest);

      expect(mockUserOperationsService.updateUrl).toHaveBeenCalledWith(
        '1',
        1,
        updateDto,
      );
      expect(result).toEqual(mockUrl);
    });

    it('should throw error for URL not found', async () => {
      mockUserOperationsService.updateUrl.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.updateUrl('999', updateDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid request', async () => {
      mockUserOperationsService.updateUrl.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.updateUrl('1', {} as UpdateUrlDto, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('DELETE /user-operations/urls/:id', () => {
    it('should delete a URL successfully', async () => {
      const mockResult = {
        affected: 1,
      };

      mockUserOperationsService.deleteUrl.mockResolvedValue(mockResult);

      const result = await controller.deleteUrl('1', mockRequest);

      expect(mockUserOperationsService.deleteUrl).toHaveBeenCalledWith('1', 1);
      expect(result).toEqual(mockResult);
    });

    it('should throw error for URL not found', async () => {
      mockUserOperationsService.deleteUrl.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.deleteUrl('999', mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
