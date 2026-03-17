import { Module } from '@nestjs/common';
import { DebugController } from './debug.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [DebugController],
})
export class DebugModule {}
