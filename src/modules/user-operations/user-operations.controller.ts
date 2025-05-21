import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserOperationsService } from './user-operations.service';
import { UpdateUrlDto } from '../url-shortening/dto/update-url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user';

@ApiTags('User Operations')
@Controller('user-operations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserOperationsController {
  constructor(private readonly userOperationsService: UserOperationsService) {}

  @Get('urls')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'List all URLs of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of URLs with total clicks',
    schema: {
      properties: {
        urls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              originalUrl: { type: 'string' },
              shortCode: { type: 'string' },
              clicks: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        totalClicks: { type: 'number' },
      },
    },
  })
  async findAllUserUrls(@Request() req: RequestWithUser) {
    return this.userOperationsService.findAllUserUrls(req.user.id);
  }

  @Patch('urls/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates an authenticated users URL' })
  @ApiResponse({
    status: 200,
    description: 'URL updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or does not belong to user',
  })
  async updateUrl(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userOperationsService.updateUrl(id, req.user.id, updateUrlDto);
  }

  @Delete('urls/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: '(Internally) deletes an authenticated users URL',
  })
  @ApiResponse({
    status: 200,
    description: 'URL deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or does not belong to user',
  })
  async deleteUrl(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.userOperationsService.deleteUrl(id, req.user.id);
  }
}
