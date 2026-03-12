import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async findAll() {
    return this.projectModel
      .find({ isPublished: true })
      .select('-sections -achievements -techStack -overview -tagline -architectureImage -architectureCaption')
      .sort({ order: 1 })
      .lean();
  }

  async findBySlug(slug: string) {
    const project = await this.projectModel
      .findOne({ slug, isPublished: true })
      .lean();
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);
    return project;
  }

  async findCasesBySlug(slug: string) {
    const project = await this.projectModel
      .findOne({ slug, isPublished: true })
      .select('slug title sections')
      .lean();
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);
    return project;
  }

  async getOverview() {
    return this.projectModel
      .find({ isPublished: true })
      .select('slug title subtitle metrics tech color tagline')
      .sort({ order: 1 })
      .lean();
  }

  async create(dto: CreateProjectDto) {
    const existing = await this.projectModel.findOne({ slug: dto.slug });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" already exists`);
    return this.projectModel.create(dto);
  }

  async update(slug: string, dto: UpdateProjectDto) {
    const project = await this.projectModel
      .findOneAndUpdate({ slug }, dto, { new: true })
      .lean();
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);
    return project;
  }

  async remove(slug: string) {
    const result = await this.projectModel.deleteOne({ slug });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Project "${slug}" not found`);
    }
    return { deleted: true };
  }

  async upsertBySlug(slug: string, data: CreateProjectDto) {
    return this.projectModel.findOneAndUpdate({ slug }, data, {
      upsert: true,
      new: true,
    });
  }
}
