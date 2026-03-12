import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../../src/ai/ai.service';

// Mock OpenAI
const mockCreate = jest.fn();
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

describe('AiService - Guardrail', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-key') },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    mockCreate.mockReset();
  });

  it('should return true for portfolio-related questions', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'true' } }],
    });

    const result = await service.checkGuardrail('주요 프로젝트에 대해 알려주세요');
    expect(result).toBe(true);
  });

  it('should return false for unrelated questions', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'false' } }],
    });

    const result = await service.checkGuardrail('오늘 날씨 어때?');
    expect(result).toBe(false);
  });

  it('should fail-open on API error', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    const result = await service.checkGuardrail('test');
    expect(result).toBe(true);
  });

  it('should call generateResponse with system prompt and messages', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'AI response' } }],
      usage: { total_tokens: 150 },
    });

    const result = await service.generateResponse('system prompt', [
      { role: 'user', content: 'hello' },
    ]);

    expect(result.content).toBe('AI response');
    expect(result.tokenUsage).toBe(150);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'system prompt' },
          { role: 'user', content: 'hello' },
        ],
      }),
    );
  });
});
