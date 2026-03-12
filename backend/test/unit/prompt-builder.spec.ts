import { ChatService } from '../../src/chat/chat.service';
import { AiService } from '../../src/ai/ai.service';

describe('ChatService - Sliding Window', () => {
  let service: ChatService;

  beforeEach(() => {
    const mockAiService = {} as AiService;
    service = new ChatService(mockAiService);
  });

  it('should return all messages when under limit', () => {
    const history = [
      { role: 'user' as const, content: 'q1' },
      { role: 'assistant' as const, content: 'a1' },
      { role: 'user' as const, content: 'q2' },
      { role: 'assistant' as const, content: 'a2' },
    ];

    const result = service.buildSlidingWindow(history);
    expect(result).toHaveLength(4);
  });

  it('should truncate to last 10 messages (5 turns) when over limit', () => {
    const history: { role: 'user' | 'assistant'; content: string }[] = [];
    for (let i = 0; i < 12; i++) {
      history.push({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `msg${i}`,
      });
    }

    const result = service.buildSlidingWindow(history);
    expect(result).toHaveLength(10);
    expect(result[0].content).toBe('msg2');
    expect(result[9].content).toBe('msg11');
  });

  it('should return empty array for empty history', () => {
    const result = service.buildSlidingWindow([]);
    expect(result).toHaveLength(0);
  });
});
