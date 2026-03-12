import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class TimelineQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  year?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tag?: string;
}
