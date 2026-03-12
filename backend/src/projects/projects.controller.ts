import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
@Public()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published projects (summary)' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('overview')
  @ApiOperation({ summary: 'Project highlights for main page' })
  getOverview() {
    return this.projectsService.getOverview();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get project detail by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':slug/cases')
  @ApiOperation({ summary: 'Get case studies for a project' })
  findCases(@Param('slug') slug: string) {
    return this.projectsService.findCasesBySlug(slug);
  }
}
