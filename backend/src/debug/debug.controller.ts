import { Controller, Get } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Controller('debug')
export class DebugController {
  constructor(private readonly chatService: ChatService) {}

  @Get('memory')
  getMemoryStats() {
    const mem = process.memoryUsage();
    const { activeSessionCount, totalEntryCount } = this.chatService.getSessionStats();
    return {
      heapUsedMB: +(mem.heapUsed / 1024 / 1024).toFixed(2),
      rssMB: +(mem.rss / 1024 / 1024).toFixed(2),
      activeSessionCount,
      totalEntryCount,
    };
  }
}
