import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MetricDto {
  @IsString()
  value: string;

  @IsString()
  label: string;
}

class DiagramDto {
  @IsString()
  type: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  caption?: string;
}

class ProblemSolutionDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  problem: string;

  @IsString()
  approach: string;

  @IsString()
  result: string;

  @IsString()
  @IsOptional()
  retrospective?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @IsString()
  @IsOptional()
  codeSnippet?: string;

  @ValidateNested()
  @Type(() => DiagramDto)
  @IsOptional()
  diagram?: DiagramDto;

  @IsString()
  @IsOptional()
  impact?: string;
}

class SectionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemSolutionDto)
  @IsOptional()
  backend?: ProblemSolutionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemSolutionDto)
  @IsOptional()
  frontend?: ProblemSolutionDto[];
}

class AchievementDto {
  @IsString()
  @IsOptional()
  metric?: string;

  @IsString()
  label: string;

  @IsString()
  description: string;
}

class TechStackCategoryDto {
  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  period: string;

  @ApiProperty()
  @IsString()
  team: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  @IsOptional()
  metrics?: MetricDto[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tech?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  github?: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  architectureImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  architectureCaption?: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SectionsDto)
  @IsOptional()
  sections?: SectionsDto;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AchievementDto)
  @IsOptional()
  achievements?: AchievementDto[];

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechStackCategoryDto)
  @IsOptional()
  techStack?: TechStackCategoryDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
