import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from '../ai/ai.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ChatLoggingInterceptor } from '../analytics/interceptors/chat-logging.interceptor';

@Module({
  imports: [AiModule, AnalyticsModule],
  controllers: [ChatController],
  providers: [ChatService, ChatLoggingInterceptor],
})
export class ChatModule {}
