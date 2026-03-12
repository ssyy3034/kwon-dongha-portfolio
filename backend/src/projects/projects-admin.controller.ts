import { Controller, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Admin - Projects')
@ApiBearerAuth()
@Controller('admin/projects')
export class ProjectsAdminController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('slug') slug: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('slug') slug: string) {
    return this.projectsService.remove(slug);
  }
}
