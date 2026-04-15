import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ResumeEntryType } from '../schemas/resume-entry.schema';

export class FilterResumeEntryDto {
  @ApiPropertyOptional({ enum: ['project', 'troubleshooting', 'experience', 'skill', 'education', 'activity', 'introduction'] })
  @IsOptional()
  @IsEnum(['project', 'troubleshooting', 'experience', 'skill', 'education', 'activity', 'introduction'])
  type?: ResumeEntryType;

  @ApiPropertyOptional({ description: 'Filter by tags (comma-separated). All tags must match.', example: 'caffeine,backend' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'aidiary' })
  @IsOptional()
  @IsString()
  projectName?: string;

  @ApiPropertyOptional({ description: 'Full-text search query', example: '스레드 고갈 RabbitMQ' })
  @IsOptional()
  @IsString()
  search?: string;
}
