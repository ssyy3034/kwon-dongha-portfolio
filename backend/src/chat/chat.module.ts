import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from '../ai/ai.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { ResumeModule } from '../resume/resume.module';
import { ChatLoggingInterceptor } from '../analytics/interceptors/chat-logging.interceptor';

@Module({
  imports: [AiModule, AnalyticsModule, ResumeModule],
  controllers: [ChatController],
  providers: [ChatService, ChatLoggingInterceptor],
  exports: [ChatService],
})
export class ChatModule {}
