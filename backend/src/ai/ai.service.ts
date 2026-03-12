import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GUARDRAIL_PROMPT } from './prompt/guardrail-prompt';

export interface AiResponse {
  content: string;
  tokenUsage: number;
}

@Injectable()
export class AiService {
  private readonly client: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async checkGuardrail(message: string): Promise<boolean> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: GUARDRAIL_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 5,
        temperature: 0,
      });

      const result = response.choices[0]?.message?.content?.trim().toLowerCase();
      return result === 'true';
    } catch (error) {
      this.logger.error('Guardrail check failed', error);
      return true; // fail-open: allow through if guardrail errors
    }
  }

  async generateResponse(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<AiResponse> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return {
      content: response.choices[0]?.message?.content ?? '',
      tokenUsage: response.usage?.total_tokens ?? 0,
    };
  }
}
