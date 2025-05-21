import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Original URL to be shortened',
    example: 'https://example.com/very-long-article',
  })
  @IsNotEmpty({ message: 'Original URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  originalUrl: string;
}
