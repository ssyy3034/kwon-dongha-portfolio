import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatLoggingInterceptor } from '../analytics/interceptors/chat-logging.interceptor';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseInterceptors(ChatLoggingInterceptor)
  @ApiOperation({ summary: 'Send a chat message' })
  async sendMessage(@Body() dto: ChatMessageDto): Promise<ChatResponseDto> {
    // Returns full object (with tokenUsage, isGuardrailPassed) for interceptor logging.
    // Interceptor strips metadata before sending to client.
    return await this.chatService.processMessage(dto);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get suggested questions' })
  getSuggestions(): string[] {
    return this.chatService.getSuggestions();
  }
}
