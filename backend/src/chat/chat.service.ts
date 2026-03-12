import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { SYSTEM_PROMPT } from '../ai/prompt/system-prompt';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto, RelatedLink } from './dto/chat-response.dto';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  '권동하는 어떤 개발자인가요?',
  'StoLink 프로젝트에서 어떤 문제를 해결했나요?',
  'API 성능을 450ms에서 25ms로 줄인 방법이 궁금해요',
  '크래프톤 정글에서 어떤 경험을 했나요?',
  'RabbitMQ로 처리량을 1,949 TPS까지 올린 이유가 뭔가요?',
];

const REDIRECT_REPLY =
  '권동하 지원자의 이력과 관련된 질문만 답변할 수 있습니다. 프로젝트, 기술 스택, 경험 등에 대해 물어봐 주세요!';

const MAX_HISTORY = 5;

@Injectable()
export class ChatService {
  private readonly sessions = new Map<string, ConversationEntry[]>();

  constructor(private readonly aiService: AiService) {}

  async processMessage(dto: ChatMessageDto): Promise<ChatResponseDto & { tokenUsage: number; isGuardrailPassed: boolean }> {
    const isRelevant = await this.aiService.checkGuardrail(dto.message);

    if (!isRelevant) {
      return {
        reply: REDIRECT_REPLY,
        relatedLinks: [],
        tokenUsage: 0,
        isGuardrailPassed: false,
      };
    }

    const history = this.getHistory(dto.sessionId);
    history.push({ role: 'user', content: dto.message });

    const messages = this.buildSlidingWindow(history);
    const response = await this.aiService.generateResponse(SYSTEM_PROMPT, messages);

    history.push({ role: 'assistant', content: response.content });
    this.sessions.set(dto.sessionId, history);

    return {
      reply: response.content,
      relatedLinks: this.extractLinks(response.content),
      tokenUsage: response.tokenUsage,
      isGuardrailPassed: true,
    };
  }

  getSuggestions(): string[] {
    return SUGGESTIONS;
  }

  private getHistory(sessionId: string): ConversationEntry[] {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    return this.sessions.get(sessionId)!;
  }

  buildSlidingWindow(history: ConversationEntry[]): ConversationEntry[] {
    if (history.length <= MAX_HISTORY * 2) {
      return [...history];
    }
    return history.slice(-(MAX_HISTORY * 2));
  }

  private extractLinks(content: string): RelatedLink[] {
    const links: RelatedLink[] = [];
    const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = urlRegex.exec(content)) !== null) {
      links.push({ title: match[1], url: match[2] });
    }

    return links;
  }
}
