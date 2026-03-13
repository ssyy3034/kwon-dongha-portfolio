import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResumeEntryType =
  | 'project'
  | 'troubleshooting'
  | 'experience'
  | 'skill'
  | 'education'
  | 'activity'
  | 'introduction';

export class Period {
  @Prop({ required: true })
  start: string;

  @Prop({ type: String, default: null })
  end: string | null;
}

export class TechStackItem {
  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], required: true })
  items: string[];
}

export class Metric {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  before: string;

  @Prop({ required: true })
  after: string;
}

@Schema({ timestamps: true })
export class ResumeEntry extends Document {
  @Prop({ required: true, enum: ['project', 'troubleshooting', 'experience', 'skill', 'education', 'activity', 'introduction'] })
  type: ResumeEntryType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Period, default: null })
  period: Period | null;

  @Prop({ type: String, default: null })
  projectName: string | null;

  // type: "project"
  @Prop({ type: [TechStackItem] })
  techStack?: TechStackItem[];

  @Prop()
  role?: string;

  @Prop()
  team?: string;

  // type: "troubleshooting"
  @Prop({ type: [Metric] })
  metrics?: Metric[];

  // type: "experience"
  @Prop()
  company?: string;

  @Prop()
  position?: string;

  // type: "skill"
  @Prop()
  category?: string;

  // type: "education"
  @Prop()
  institution?: string;

  @Prop()
  degree?: string;
}

export const ResumeEntrySchema = SchemaFactory.createForClass(ResumeEntry);

// 1. Tag filtering (core query)
ResumeEntrySchema.index({ tags: 1 });

// 2. Type + tag compound filter
ResumeEntrySchema.index({ type: 1, tags: 1 });

// 3. Project-scoped lookup
ResumeEntrySchema.index({ projectName: 1, type: 1 });

// 4. Full-text search (chatbot RAG)
ResumeEntrySchema.index(
  { title: 'text', summary: 'text', content: 'text' },
  { weights: { title: 10, summary: 5, content: 1 }, default_language: 'none' },
);
