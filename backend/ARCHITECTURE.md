# NestJS 백엔드 아키텍처

## 모듈 구조

```
AppModule
├── ChatModule      — AI 챗봇 API (POST /api/chat, GET /api/chat/suggestions)
├── AiModule        — OpenAI GPT-4o-mini 호출 (가드레일 + 응답 생성)
├── AnalyticsModule — 채팅 로그 MongoDB 저장
└── ResumeModule    — 이력서 데이터 CRUD + 챗봇용 텍스트 검색 (간이 RAG)
```

---

## 1. main.ts — 앱 부트스트랩

- 글로벌 프리픽스 `/api`
- CORS: 환경변수 `CORS_ORIGIN`에서 쉼표 구분 도메인 허용
- `ValidationPipe` (whitelist + transform) — DTO에 정의 안 된 필드 자동 제거
- `HttpExceptionFilter` — 전역 예외를 `{ statusCode, message, timestamp }` 포맷으로 통일
- Swagger: 비프로덕션 환경에서만 `/api/docs`에 자동 생성
- ThrottlerGuard: 전역 Rate Limit (60초당 200요청)

---

## 2. ChatModule

### ChatController

- `POST /api/chat` — `@UseInterceptors(ChatLoggingInterceptor)` 적용
- `GET /api/chat/suggestions` — 추천 질문 5개 반환

### ChatService

- 인메모리 `Map<sessionId, ConversationEntry[]>`로 세션 관리
- `processMessage()` 흐름:
  1. MongoDB에서 질문 관련 이력서 데이터 텍스트 검색 (간이 RAG)
  2. 검색 결과를 시스템 프롬프트에 컨텍스트로 주입
  3. 슬라이딩 윈도우 (최근 5턴)로 대화 히스토리 관리
  4. GPT-4o-mini 호출
  5. 응답에서 마크다운 링크 추출 → `relatedLinks` 반환
- 응답에 `tokenUsage`, `isGuardrailPassed` 메타데이터 포함 → 인터셉터가 클라이언트 전달 전 제거

### ChatLoggingInterceptor

- RxJS `pipe(map())` — 성공 시 `AnalyticsService.logChat()` fire-and-forget 호출 후 메타데이터(`tokenUsage`, `isGuardrailPassed`) 제거
- `catchError()` — 실패 시에도 로깅 (isSuccess: false)

### DTO

- `ChatMessageDto` — `@IsUUID() sessionId`, `@MaxLength(500) message`
- `ChatResponseDto` — `reply`, `relatedLinks[]`

---

## 3. AiModule

### AiService

- `checkGuardrail(message)` — GPT-4o-mini에 가드레일 프롬프트 전달, `true`/`false` 판정. max_tokens: 5, temperature: 0. 실패 시 fail-open (true 반환)
- `generateResponse(systemPrompt, messages)` — GPT-4o-mini 호출, `{ content, tokenUsage }` 반환. max_tokens: 1024, temperature: 0.7

### 프롬프트

- `system-prompt.ts` — 권동하 본인 1인칭 페르소나, Teaser Rule (핵심 20%만 요약 → 면접 유도), 거절 기준, 톤 규칙, Knowledge Base
- `guardrail-prompt.ts` — 포트폴리오 관련 질문이면 `true`, 무관하면 `false` 판정

---

## 4. AnalyticsModule

### AnalyticsService

- `logChat(data)` — MongoDB에 채팅 로그 저장 (실패해도 에러 삼킴)

### ChatLog 스키마

| 필드 | 타입 | 설명 |
|------|------|------|
| sessionId | string | 세션 UUID |
| question | string | 사용자 질문 |
| tokenUsage | number | 토큰 사용량 |
| responseTimeMs | number | 응답 시간 (ms) |
| isGuardrailPassed | boolean | 가드레일 통과 여부 |
| isSuccess | boolean | 응답 성공 여부 |
| createdAt | Date | 생성 시각 |

- TTL 인덱스: 90일 후 자동 삭제

---

## 5. ResumeModule

### ResumeController — REST API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/resume` | 생성 |
| GET | `/api/resume` | 필터 조회 (type, tags, projectName, 전문 검색) |
| GET | `/api/resume/tags` | 모든 태그 목록 |
| GET | `/api/resume/stats/tags` | 태그별 사용 통계 (aggregation) |
| GET | `/api/resume/stats/types` | 타입별 개수 통계 (aggregation) |
| GET | `/api/resume/:id` | 단건 조회 |
| PATCH | `/api/resume/:id` | 수정 |
| DELETE | `/api/resume/:id` | 삭제 |

### ResumeService

- `findAll()` — `FilterQuery` 동적 조합 (type, tags `$all`, projectName, `$text` 전문검색)
- `searchForChatbot(query)` — 챗봇 RAG용. `$text` 검색 → `textScore` 정렬 → 상위 5건 lean 반환. 실패 시 regex fallback
- `getTagStats()` / `getTypeStats()` — MongoDB aggregation ($unwind → $group → $sort)

### ResumeEntry 스키마

**7가지 타입:** `project`, `troubleshooting`, `experience`, `skill`, `education`, `activity`, `introduction`

**공통 필드:**

| 필드 | 타입 | 설명 |
|------|------|------|
| type | enum | 엔트리 타입 |
| title | string | 제목 |
| summary | string | 요약 |
| content | string | 본문 |
| tags | string[] | 태그 |
| period | { start, end } | 기간 |

**타입별 선택 필드:**

| 필드 | 대상 타입 |
|------|-----------|
| techStack[], role, team | project |
| metrics[] | troubleshooting |
| company, position | experience |
| category | skill |
| institution, degree | education |

**인덱스 (4개):**

| 인덱스 | 용도 |
|--------|------|
| `{ tags: 1 }` | 태그 필터링 |
| `{ type: 1, tags: 1 }` | 타입 + 태그 복합 필터 |
| `{ projectName: 1, type: 1 }` | 프로젝트 스코프 조회 |
| `{ title: text, summary: text, content: text }` | 전문 검색 (가중치 10:5:1) |

### ResumeSeedService

- `OnModuleInit` — 앱 시작 시 컬렉션이 비어있으면 시드 데이터 자동 삽입 (이력서·프로젝트·트러블슈팅·스킬·교육·활동 총 30+건)

---

## 6. 공통

- **HttpExceptionFilter** — 모든 예외를 `{ statusCode, message, timestamp }` JSON 포맷으로 통일
- **@Public() 데코레이터** — `SetMetadata('isPublic', true)` (ThrottlerGuard 바이패스용으로 준비)
