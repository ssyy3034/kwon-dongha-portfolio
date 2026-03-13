import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { CreateResumeEntryDto } from './dto/create-resume-entry.dto';
import { FilterResumeEntryDto } from './dto/filter-resume-entry.dto';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a resume entry' })
  create(@Body() dto: CreateResumeEntryDto) {
    return this.resumeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Filter resume entries by type, tags, project, or text search' })
  findAll(@Query() filter: FilterResumeEntryDto) {
    return this.resumeService.findAll(filter);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all unique tags' })
  getAllTags() {
    return this.resumeService.getAllTags();
  }

  @Get('stats/tags')
  @ApiOperation({ summary: 'Get tag usage statistics' })
  getTagStats() {
    return this.resumeService.getTagStats();
  }

  @Get('stats/types')
  @ApiOperation({ summary: 'Get entry count by type' })
  getTypeStats() {
    return this.resumeService.getTypeStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resume entry by ID' })
  findById(@Param('id') id: string) {
    return this.resumeService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a resume entry' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateResumeEntryDto>) {
    return this.resumeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resume entry' })
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}
