import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimelineEventDocument = HydratedDocument<TimelineEvent>;

@Schema({ _id: false })
export class TimelineDisplay {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: false })
  featured: boolean;
}

@Schema({ timestamps: true })
export class TimelineEvent {
  @Prop({ required: true })
  date: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['education', 'project', 'career', 'milestone', 'learning', 'certification'],
  })
  type: string;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop()
  relatedProjectSlug?: string;

  @Prop({ type: TimelineDisplay, default: { icon: 'code', color: 'blue', featured: false } })
  display: TimelineDisplay;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isPublished: boolean;
}

export const TimelineEventSchema = SchemaFactory.createForClass(TimelineEvent);
TimelineEventSchema.index({ date: -1 });
