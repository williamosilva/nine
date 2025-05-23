import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiBody, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user and return access and refresh tokens',
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
    examples: {
      example: {
        summary: 'Login example',
        value: {
          email: 'usuario@email.com',
          password: 'Password123!',
        },
      },
    },
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user and return tokens' })
  @ApiBody({
    description: 'Data for new user registration',
    type: RegisterDto,
    examples: {
      example: {
        summary: 'Example record',
        value: {
          name: 'João da Silva',
          email: 'joao@email.com',
          password: 'Password123!',
        },
      },
    },
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Use a refresh token to get new access and refresh tokens',
  })
  @ApiBody({
    description: 'Refresh token to get new tokens',
    type: RefreshTokenDto,
  })
  async refreshTokens(
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout the current user and invalidate refresh token',
  })
  async logout(
    @GetUser() user: User,
  ): Promise<{ success: boolean; message: string }> {
    const { success, message } = await this.authService.logout(user.id);
    return {
      success,
      message,
    };
  }
}
