import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DisplayDto {
  @IsString()
  icon: string;

  @IsString()
  color: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}

export class CreateTimelineEventDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ['education', 'project', 'career', 'milestone', 'learning', 'certification'] })
  @IsEnum(['education', 'project', 'career', 'milestone', 'learning', 'certification'])
  type: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  relatedProjectSlug?: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => DisplayDto)
  @IsOptional()
  display?: DisplayDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
