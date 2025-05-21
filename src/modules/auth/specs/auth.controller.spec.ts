import { Test, TestingModule } from '@nestjs/testing';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from '../../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'access',
    refreshToken: 'refresh',
    user: {
      id: 1,
      name: 'Test',
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const authServiceMock: Partial<jest.Mocked<AuthService>> = {
      login: jest.fn().mockResolvedValue(mockAuthResponse),
      register: jest.fn().mockResolvedValue(mockAuthResponse),
      refreshTokens: jest.fn().mockResolvedValue(mockAuthResponse),
      logout: jest.fn().mockResolvedValue({
        success: true,
        message: 'Logout successful',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should return auth response with 200 status', async () => {
      const loginMock = jest.fn().mockResolvedValue(mockAuthResponse);
      jest.spyOn(authService, 'login').mockImplementation(loginMock);

      const result = await controller.login({} as LoginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(loginMock).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return auth response with 201 status', async () => {
      const registerMock = jest.fn().mockResolvedValue(mockAuthResponse);
      jest.spyOn(authService, 'register').mockImplementation(registerMock);

      const result = await controller.register({} as RegisterDto);

      expect(result).toEqual(mockAuthResponse);
      expect(registerMock).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens', async () => {
      const refreshTokensMock = jest.fn().mockResolvedValue(mockAuthResponse);
      jest
        .spyOn(authService, 'refreshTokens')
        .mockImplementation(refreshTokensMock);

      const result = await controller.refreshTokens({} as RefreshTokenDto);

      expect(result).toEqual(mockAuthResponse);
      expect(refreshTokensMock).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const mockUser = { id: 1 } as User;
      const logoutMock = jest.fn().mockResolvedValue({
        success: true,
        message: 'Logout successful',
      });
      jest.spyOn(authService, 'logout').mockImplementation(logoutMock);

      const result = await controller.logout(mockUser);

      expect(result.success).toBe(true);
      expect(logoutMock).toHaveBeenCalledWith(1);
    });
  });
});
