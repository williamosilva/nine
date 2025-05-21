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
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { User } from 'src/modules/users/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
