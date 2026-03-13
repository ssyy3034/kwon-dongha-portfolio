import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ResumeEntry } from './schemas/resume-entry.schema';
import { CreateResumeEntryDto } from './dto/create-resume-entry.dto';
import { FilterResumeEntryDto } from './dto/filter-resume-entry.dto';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    @InjectModel(ResumeEntry.name) private readonly model: Model<ResumeEntry>,
  ) {}

  async create(dto: CreateResumeEntryDto): Promise<ResumeEntry> {
    return this.model.create(dto);
  }

  async findAll(filter: FilterResumeEntryDto): Promise<ResumeEntry[]> {
    const query: FilterQuery<ResumeEntry> = {};

    if (filter.type) {
      query.type = filter.type;
    }

    if (filter.tags?.length) {
      query.tags = { $all: filter.tags };
    }

    if (filter.projectName) {
      query.projectName = filter.projectName;
    }

    if (filter.search) {
      query.$text = { $search: filter.search };
    }

    const cursor = this.model.find(query);

    if (filter.search) {
      cursor.select({ score: { $meta: 'textScore' } });
      cursor.sort({ score: { $meta: 'textScore' } });
    }

    return cursor.exec();
  }

  async findById(id: string): Promise<ResumeEntry> {
    const entry = await this.model.findById(id).exec();
    if (!entry) throw new NotFoundException(`Entry ${id} not found`);
    return entry;
  }

  async update(id: string, dto: Partial<CreateResumeEntryDto>): Promise<ResumeEntry> {
    const entry = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!entry) throw new NotFoundException(`Entry ${id} not found`);
    return entry;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Entry ${id} not found`);
  }

  async getTagStats(): Promise<{ tag: string; count: number }[]> {
    return this.model.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);
  }

  async getTypeStats(): Promise<{ type: string; count: number }[]> {
    return this.model.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, type: '$_id', count: 1 } },
    ]);
  }

  async getAllTags(): Promise<string[]> {
    const result = await this.model.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $sort: { _id: 1 } },
    ]);
    return result.map((r) => r._id);
  }

  async findByTags(tags: string[]): Promise<ResumeEntry[]> {
    return this.model.find({ tags: { $all: tags } }).exec();
  }

  async searchForChatbot(query: string): Promise<Pick<ResumeEntry, 'type' | 'title' | 'summary' | 'tags' | 'metrics'>[]> {
    return this.model
      .find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } },
      )
      .select('type title summary tags metrics')
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
      .lean()
      .exec();
  }
}
