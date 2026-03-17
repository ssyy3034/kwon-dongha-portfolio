import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AiService } from '../ai/ai.service';
import { ResumeService } from '../resume/resume.service';
import { SYSTEM_PROMPT } from '../ai/prompt/system-prompt';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto, RelatedLink } from './dto/chat-response.dto';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface SessionData {
  entries: ConversationEntry[];
  lastAccessedAt: number;
}

const SUGGESTIONS = [
  '권동하는 어떤 개발자인가요?',
  'StoLink 프로젝트에서 어떤 문제를 해결했나요?',
  'API 성능을 450ms에서 25ms로 줄인 방법이 궁금해요',
  '크래프톤 정글에서 어떤 경험을 했나요?',
  'RabbitMQ로 처리량을 1,949 TPS까지 올린 이유가 뭔가요?',
];

const MAX_HISTORY = 5;
const SESSION_TTL_MS = (parseInt(process.env.SESSION_TTL_MINUTES ?? '30', 10)) * 60_000;
const CLEANUP_INTERVAL_MS = (parseInt(process.env.CLEANUP_INTERVAL_MINUTES ?? '10', 10)) * 60_000;

@Injectable()
export class ChatService {
  private readonly sessions = new Map<string, SessionData>();
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly resumeService: ResumeService,
  ) {}

  async processMessage(dto: ChatMessageDto): Promise<ChatResponseDto & { tokenUsage: number; isGuardrailPassed: boolean }> {
    const session = this.getSession(dto.sessionId);
    session.lastAccessedAt = Date.now();
    session.entries.push({ role: 'user', content: dto.message });

    // MongoDB에서 관련 데이터 검색 (간이 RAG)
    const context = await this.buildContext(dto.message);
    const prompt = context
      ? `${SYSTEM_PROMPT}\n\n# 관련 포트폴리오 데이터 (MongoDB 검색 결과 — 이 데이터를 기반으로 정확하게 답변해. 이 데이터에 없는 내용은 추측하지 마.)\n${context}`
      : SYSTEM_PROMPT;

    const messages = this.buildSlidingWindow(session.entries);
    const response = await this.aiService.generateResponse(prompt, messages);

    session.entries.push({ role: 'assistant', content: response.content });

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

  private async buildContext(message: string): Promise<string> {
    try {
      const results = await this.resumeService.searchForChatbot(message);
      if (!results.length) return '';

      return results
        .map((entry) => {
          let text = `[${entry.type}] ${entry.title}\n${entry.summary}`;
          if (entry.metrics?.length) {
            text += '\n성과: ' + entry.metrics.map((m) => `${m.label}: ${m.before} → ${m.after}`).join(', ');
          }
          if (entry.tags?.length) {
            text += `\n태그: ${entry.tags.join(', ')}`;
          }
          return text;
        })
        .join('\n\n');
    } catch (error) {
      this.logger.error('Failed to search resume entries', error);
      return '';
    }
  }

  getSessionStats(): { activeSessionCount: number; totalEntryCount: number } {
    let totalEntryCount = 0;
    for (const session of this.sessions.values()) {
      totalEntryCount += session.entries.length;
    }
    return { activeSessionCount: this.sessions.size, totalEntryCount };
  }

  @Interval(CLEANUP_INTERVAL_MS)
  cleanExpiredSessions(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastAccessedAt > SESSION_TTL_MS) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      this.logger.log(`Cleaned ${cleaned} expired sessions (TTL: ${SESSION_TTL_MS / 60_000}min)`);
    }
  }

  private getSession(sessionId: string): SessionData {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, { entries: [], lastAccessedAt: Date.now() });
    }
    const session = this.sessions.get(sessionId)!;
    session.lastAccessedAt = Date.now();
    return session;
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
