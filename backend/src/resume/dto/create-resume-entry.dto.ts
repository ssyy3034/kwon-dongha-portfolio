import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResumeEntryType } from '../schemas/resume-entry.schema';

class PeriodDto {
  @ApiProperty({ example: '2025-04' })
  @IsString()
  start: string;

  @ApiPropertyOptional({ example: '2026-02', nullable: true })
  @IsOptional()
  @IsString()
  end?: string | null;
}

class TechStackItemDto {
  @ApiProperty({ example: 'Backend' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['Spring Boot', 'Caffeine'] })
  @IsArray()
  @IsString({ each: true })
  items: string[];
}

class MetricDto {
  @ApiProperty({ example: '응답시간' })
  @IsString()
  label: string;

  @ApiProperty({ example: '487ms' })
  @IsString()
  before: string;

  @ApiProperty({ example: '3ms' })
  @IsString()
  after: string;
}

export class CreateResumeEntryDto {
  @ApiProperty({ enum: ['project', 'troubleshooting', 'experience', 'skill', 'education', 'activity', 'introduction'] })
  @IsEnum(['project', 'troubleshooting', 'experience', 'skill', 'education', 'activity', 'introduction'])
  type: ResumeEntryType;

  @ApiProperty({ example: 'Caffeine 컨텍스트 해시 기반 캐싱' })
  @IsString()
  title: string;

  @ApiProperty({ example: '매 요청마다 Gemini API 호출하던 구조를 Caffeine 캐싱으로 최소화' })
  @IsString()
  summary: string;

  @ApiProperty({ example: '## 경험 3. 외부 AI API 반복 호출...' })
  @IsString()
  content: string;

  @ApiProperty({ example: ['caffeine', '캐싱', 'backend', '성능최적화'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags: string[];

  @ApiPropertyOptional({ type: PeriodDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDto)
  period?: PeriodDto | null;

  @ApiPropertyOptional({ example: 'aidiary' })
  @IsOptional()
  @IsString()
  projectName?: string | null;

  @ApiPropertyOptional({ type: [TechStackItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TechStackItemDto)
  techStack?: TechStackItemDto[];

  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() team?: string;

  @ApiPropertyOptional({ type: [MetricDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  metrics?: MetricDto[];

  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() institution?: string;
  @IsOptional() @IsString() degree?: string;
}
