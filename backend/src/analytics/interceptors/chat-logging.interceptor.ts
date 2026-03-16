import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AnalyticsService } from '../analytics.service';

@Injectable()
export class ChatLoggingInterceptor implements NestInterceptor {
  constructor(private readonly analyticsService: AnalyticsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (request.method !== 'POST' || !body?.sessionId) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      map((response) => {
        // Fire-and-forget async logging
        this.analyticsService
          .logChat({
            sessionId: body.sessionId,
            question: body.message,
            tokenUsage: response?.tokenUsage ?? 0,
            responseTimeMs: Date.now() - startTime,
            isGuardrailPassed: response?.isGuardrailPassed ?? true,
            isSuccess: true,
          })
          .catch(() => {});

        // Strip internal metadata before sending to client
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tokenUsage, isGuardrailPassed, ...clientResponse } = response;
        return clientResponse;
      }),
      catchError((error) => {
        this.analyticsService
          .logChat({
            sessionId: body.sessionId,
            question: body.message,
            tokenUsage: 0,
            responseTimeMs: Date.now() - startTime,
            isGuardrailPassed: false,
            isSuccess: false,
          })
          .catch(() => {});
        return throwError(() => error);
      }),
    );
  }
}
