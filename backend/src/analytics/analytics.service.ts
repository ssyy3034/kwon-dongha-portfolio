import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatLog } from './schemas/chat-log.schema';

export interface ChatLogData {
  sessionId: string;
  question: string;
  tokenUsage: number;
  responseTimeMs: number;
  isGuardrailPassed: boolean;
  isSuccess: boolean;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(ChatLog.name) private readonly chatLogModel: Model<ChatLog>,
  ) {}

  async logChat(data: ChatLogData): Promise<void> {
    try {
      await this.chatLogModel.create(data);
    } catch (error) {
      this.logger.error('Failed to save chat log', error);
    }
  }
}
