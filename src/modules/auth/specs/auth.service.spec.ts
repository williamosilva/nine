import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;
  // let configService: ConfigService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    refreshToken: 'hashedRefreshToken',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const usersRepositoryMock: Partial<Repository<User>> = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const jwtServiceMock: Partial<JwtService> = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    };

    const configServiceMock: Partial<ConfigService> = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'JWT_SECRET':
            return 'secret';
          case 'JWT_EXPIRATION':
            return '1h';
          case 'JWT_REFRESH_SECRET':
            return 'refresh_secret';
          case 'JWT_REFRESH_EXPIRATION':
            return '7d';
          default:
            return undefined;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  describe('login', () => {
    it('should return tokens and user data for valid credentials', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('accessToken');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('refreshToken');

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('accessToken');
      expect(result.refreshToken).toBe('refreshToken');

      expect(jest.spyOn(usersRepository, 'update')).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@example.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user and return tokens', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('accessToken');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('refreshToken');

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.user.email).toBe('test@example.com');

      expect(jest.spyOn(usersRepository, 'save')).toHaveBeenCalled();
    });

    it('should throw ConflictException for existing email', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(
        service.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle registration errors', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(usersRepository, 'save')
        .mockRejectedValue(new Error('DB Error'));

      await expect(
        service.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens for valid refresh token', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 1 });
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('newAccess');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('newRefresh');

      const result = await service.refreshTokens({ refreshToken: 'valid' });

      expect(result.accessToken).toBe('newAccess');

      expect(jest.spyOn(usersRepository, 'update')).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for invalid token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.refreshTokens({ refreshToken: 'invalid' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user not found', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 999 });
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.refreshTokens({ refreshToken: 'valid' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      jest.spyOn(usersRepository, 'update').mockResolvedValue(mockUpdateResult);

      const result = await service.logout(1);

      expect(result.success).toBe(true);

      expect(jest.spyOn(usersRepository, 'update')).toHaveBeenCalledWith(1, {
        refreshToken: null,
      });
    });
  });
});
