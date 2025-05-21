import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'URL original que será encurtada',
    example: 'https://exemplo.com/artigo-muito-longo',
  })
  @IsNotEmpty({ message: 'A URL original não pode ser vazia' })
  @IsUrl({}, { message: 'Formato de URL inválido' })
  originalUrl: string;
}
