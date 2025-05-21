import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'Original URL that will be updated',
    example: 'https://new-example.com/updated-article',
  })
  @IsNotEmpty({ message: 'Original URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  originalUrl: string;
}
