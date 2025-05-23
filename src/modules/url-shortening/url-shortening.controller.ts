import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { UrlShorteningService } from './url-shortening.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('Url')
@Controller()
export class UrlShorteningController {
  constructor(private readonly urlService: UrlShorteningService) {}

  @Post('url')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'Shorten a URL',
    description:
      'Find a URL. If authenticated, the URL is associated with the user.',
  })
  @ApiBody({
    description: 'URL data to be shortened',
    type: CreateUrlDto,
    examples: {
      example: {
        summary: 'Example of shortening',
        value: {
          originalUrl: 'https://example.com/very-long-article',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'URL shortened successfully',
    schema: {
      example: {
        shortUrl: 'http://localhost/aZbKq7',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    const shortUrl = await this.urlService.shortenUrl(createUrlDto);
    return { shortUrl };
  }

  @Get('resolve/:shortCode')
  @ApiOperation({
    summary: 'Get original URL (without redirect for swagger testing)',
    description:
      'Returns the original URL without redirecting. Useful for testing in Swagger. Increments the click counter.',
  })
  @ApiParam({ name: 'shortCode', example: 'aZbKq7' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        originalUrl: 'https://example.com/very-long-article',
      },
    },
  })
  async getOriginalUrlJSON(@Param('shortCode') shortCode: string) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    return { originalUrl };
  }

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redirect to the original URL using the shortcode',
    description:
      'Redirects to the original URL based on the provided shortcode and increments the click counter. ⚠️ Note: This redirect may not work properly when tested via Swagger UI due to browser security restrictions (CORS).',
  })
  @ApiParam({
    name: 'shortCode',
    example: 'aZbKq7',
    description: 'Shortcode generated by the system',
  })
  @ApiResponse({
    status: 302,
    description: 'Successful redirect to the original URL (no response body)',
  })
  @ApiResponse({
    status: 400,
    description: 'Shortcode not found',
  })
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    return res.redirect(originalUrl);
  }
}
