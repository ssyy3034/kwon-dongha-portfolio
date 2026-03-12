import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { TimelineEvent, TimelineEventDocument } from './schemas/timeline-event.schema';
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';
import { UpdateTimelineEventDto } from './dto/update-timeline-event.dto';
import { TimelineQueryDto } from './dto/timeline-query.dto';

@Injectable()
export class TimelineService {
  constructor(
    @InjectModel(TimelineEvent.name)
    private timelineModel: Model<TimelineEventDocument>,
  ) {}

  async findAll(query: TimelineQueryDto) {
    const filter: FilterQuery<TimelineEvent> = { isPublished: true };

    if (query.type) filter.type = query.type;
    if (query.tag) filter.tags = query.tag;
    if (query.year) {
      const year = parseInt(query.year);
      filter.date = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      };
    }

    return this.timelineModel.find(filter).sort({ date: -1 }).lean();
  }

  async create(dto: CreateTimelineEventDto) {
    return this.timelineModel.create(dto);
  }

  async update(id: string, dto: UpdateTimelineEventDto) {
    const event = await this.timelineModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!event) throw new NotFoundException('Timeline event not found');
    return event;
  }

  async remove(id: string) {
    const result = await this.timelineModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Timeline event not found');
    }
    return { deleted: true };
  }
}
