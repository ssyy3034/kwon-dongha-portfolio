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

  async getStats(days: number) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [result] = await this.chatLogModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          successCount: { $sum: { $cond: ['$isSuccess', 1, 0] } },
          guardrailBlockCount: { $sum: { $cond: ['$isGuardrailPassed', 0, 1] } },
          totalTokenUsage: { $sum: '$tokenUsage' },
          avgResponseTimeMs: { $avg: '$responseTimeMs' },
          responseTimes: { $push: '$responseTimeMs' },
        },
      },
    ]);

    if (!result) {
      return {
        period: `last${days}d`,
        totalChats: 0,
        uniqueSessions: 0,
        successRate: 0,
        guardrailBlockRate: 0,
        avgResponseTimeMs: 0,
        p95ResponseTimeMs: 0,
        totalTokenUsage: 0,
        avgTokensPerChat: 0,
      };
    }

    const sorted = result.responseTimes.sort((a: number, b: number) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);

    return {
      period: `last${days}d`,
      totalChats: result.totalChats,
      uniqueSessions: result.uniqueSessions.length,
      successRate: +((result.successCount / result.totalChats) * 100).toFixed(1),
      guardrailBlockRate: +((result.guardrailBlockCount / result.totalChats) * 100).toFixed(1),
      avgResponseTimeMs: +result.avgResponseTimeMs.toFixed(0),
      p95ResponseTimeMs: sorted[p95Index] ?? 0,
      totalTokenUsage: result.totalTokenUsage,
      avgTokensPerChat: +(result.totalTokenUsage / result.totalChats).toFixed(1),
    };
  }

  async getDailyTrend(days: number) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return this.chatLogModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          chats: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          avgResponseTimeMs: { $avg: '$responseTimeMs' },
          tokenUsage: { $sum: '$tokenUsage' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          chats: 1,
          uniqueSessions: { $size: '$uniqueSessions' },
          avgResponseTimeMs: { $round: ['$avgResponseTimeMs', 0] },
          tokenUsage: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }
}
