import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ _id: false })
export class Diagram {
  @Prop({ required: true, enum: ['mermaid', 'image'] })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  caption?: string;
}

@Schema({ _id: false })
export class ProblemSolution {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle?: string;

  @Prop({ required: true })
  problem: string;

  @Prop({ required: true })
  approach: string;

  @Prop({ required: true })
  result: string;

  @Prop()
  retrospective?: string;

  @Prop([String])
  details?: string[];

  @Prop()
  codeSnippet?: string;

  @Prop({ type: Diagram })
  diagram?: Diagram;

  @Prop()
  impact?: string;
}

@Schema({ _id: false })
export class Metric {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  label: string;
}

@Schema({ _id: false })
export class Achievement {
  @Prop()
  metric?: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
export class TechStackCategory {
  @Prop({ required: true })
  category: string;

  @Prop([String])
  items: string[];
}

@Schema({ _id: false })
export class ProjectSections {
  @Prop({ type: [ProblemSolution], default: [] })
  backend: ProblemSolution[];

  @Prop({ type: [ProblemSolution], default: [] })
  frontend: ProblemSolution[];
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  team: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Metric], default: [] })
  metrics: Metric[];

  @Prop({ type: [String], default: [] })
  tech: string[];

  @Prop()
  github?: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: 0 })
  order: number;

  // Detail fields
  @Prop()
  tagline?: string;

  @Prop()
  overview?: string;

  @Prop()
  architectureImage?: string;

  @Prop()
  architectureCaption?: string;

  @Prop({ type: ProjectSections, default: { backend: [], frontend: [] } })
  sections: ProjectSections;

  @Prop({ type: [Achievement], default: [] })
  achievements: Achievement[];

  @Prop({ type: [TechStackCategory], default: [] })
  techStack: TechStackCategory[];

  @Prop({ default: true })
  isPublished: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
