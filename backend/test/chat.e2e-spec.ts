import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ChatService } from '../src/chat/chat.service';
import { AnalyticsService } from '../src/analytics/analytics.service';
import { ChatController } from '../src/chat/chat.controller';
import { ChatLoggingInterceptor } from '../src/analytics/interceptors/chat-logging.interceptor';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let chatService: ChatService;
  let analyticsService: AnalyticsService;

  beforeAll(async () => {
    const mockAnalyticsService = {
      logChat: jest.fn().mockResolvedValue(undefined),
    };

    const mockChatService = {
      processMessage: jest.fn(),
      getSuggestions: jest.fn().mockReturnValue([
        '권동하는 어떤 개발자인가요?',
        '주요 프로젝트에 대해 알려주세요',
      ]),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        ChatLoggingInterceptor,
      ],
    }).compile();

    app = testingModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    chatService = testingModule.get<ChatService>(ChatService);
    analyticsService = testingModule.get<AnalyticsService>(AnalyticsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /chat', () => {
    it('should return a chat response', async () => {
      (chatService.processMessage as jest.Mock).mockResolvedValue({
        reply: '안녕하세요! 권동하의 포트폴리오에 대해 물어봐 주세요.',
        relatedLinks: [],
        tokenUsage: 100,
        isGuardrailPassed: true,
      });

      const res = await request(app.getHttpServer())
        .post('/chat')
        .send({
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
          message: '안녕하세요',
        })
        .expect(201);

      expect(res.body.reply).toBeDefined();
      expect(res.body.relatedLinks).toBeDefined();
      // Metadata should be stripped by interceptor
      expect(res.body.tokenUsage).toBeUndefined();
      expect(res.body.isGuardrailPassed).toBeUndefined();
    });

    it('should log chat via analytics interceptor', async () => {
      (chatService.processMessage as jest.Mock).mockResolvedValue({
        reply: 'test reply',
        relatedLinks: [],
        tokenUsage: 50,
        isGuardrailPassed: true,
      });

      await request(app.getHttpServer())
        .post('/chat')
        .send({
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
          message: 'test question',
        })
        .expect(201);

      expect(analyticsService.logChat).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
          question: 'test question',
          isSuccess: true,
        }),
      );
    });

    it('should reject invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/chat')
        .send({ message: 'no sessionId' })
        .expect(400);
    });
  });

  describe('GET /chat/suggestions', () => {
    it('should return suggestion list', async () => {
      const res = await request(app.getHttpServer())
        .get('/chat/suggestions')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});
