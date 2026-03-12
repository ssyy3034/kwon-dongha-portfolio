import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ChatLog extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ default: 0 })
  tokenUsage: number;

  @Prop({ required: true })
  responseTimeMs: number;

  @Prop({ required: true })
  isGuardrailPassed: boolean;

  @Prop({ required: true })
  isSuccess: boolean;

  @Prop()
  createdAt: Date;
}

export const ChatLogSchema = SchemaFactory.createForClass(ChatLog);

// TTL index: auto-delete after 90 days
ChatLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
