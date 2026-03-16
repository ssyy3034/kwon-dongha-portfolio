import { CreateResumeEntryDto } from '../dto/create-resume-entry.dto';

export const SEED_DATA: CreateResumeEntryDto[] = [
  // ═══════════════════════════════════════════════════
  // INTRODUCTION
  // ═══════════════════════════════════════════════════
  {
    type: 'introduction',
    title: '자기소개',
    summary: '기술에 다정함을 담아 옳은 방향으로 전달하는 신입 백엔드 엔지니어',
    content:
      '기술에 다정함을 담아 옳은 방향으로 전달하는 신입 백엔드 엔지니어 권동하입니다.\n\n' +
      '**기본기에 충실한 기술의 도입**: 탄탄한 기반이 있어야 새로운 기술도 제대로 활용할 수 있다고 생각합니다. 크래프톤 정글에서 5개월간의 몰입을 통해 자료구조, 알고리즘, OS 커널(Pintos) 개발로 CS 지식을 다지고, Spring Boot를 통해 객체 지향과 백엔드 아키텍처를 학습했습니다.\n\n' +
      '**팀 생산성을 고민하는 팀원**: 다년간의 아르바이트 경험을 통해 다양한 성향을 가진 팀원들의 장점을 파악하고, 서로 협력하여 시너지를 이끌어내는 소통 방식을 체득했습니다. 반복되는 Git 커밋, PR 작업이 팀의 병목이 되는 것을 파악하여 Antigravity의 커스텀 커맨드 기능을 활용해 팀의 개발 속도를 높였습니다.',
    tags: ['backend', '팀워크', 'DX', '리더십'],
    period: null,
  },

  // ═══════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════
  {
    type: 'project',
    title: 'StoLink & StoRead : 웹소설 작가를 위한 지식 관리 플랫폼',
    summary:
      '웹소설 작가가 글을 쓰면 AI가 인물·관계·사건을 자동 분석하여 그래프로 시각화해주는 창작 보조 플랫폼. OAuth2 인증, 결제 시스템, Canvas 관계도, 에디터 구현.',
    content:
      '웹소설 작가가 글을 쓰면 AI가 인물·관계·사건을 자동 분석하여 그래프로 시각화해주는 창작 보조 플랫폼입니다. 작가는 StoLink에서 에디터와 데이터 시각화를 통해 체계적으로 글을 쓰고, 배포한 글을 통해 StoRead에서 독자들이 관계도와 함께 작품을 열람하거나 구매할 수 있습니다.\n\n' +
      '담당 구현:\n' +
      '- Backend: OAuth2 기반 소셜 로그인 및 JWT 토큰(HTTP-only Cookie) 인증/인가 시스템, Spring Data JPA 무한 계층 구조 문서 폴더 트리 CRUD, 토스페이먼츠 연동 크레딧 충전 시스템 및 웹훅 처리\n' +
      '- Frontend: StoLink 작가용 웹앱 전체 화면 설계 및 개발, Tiptap 기반 커스텀 리치 텍스트 에디터, Canvas API 소설 인물 관계도 시각화 (650+ 노드 60FPS), 폴더 트리 기반 문서 탐색 사이드바\n' +
      '- DX: Antigravity 커스텀 커맨드로 이슈 → 브랜치 → 커밋 → PR 단일 명령 자동화, 부트캠프 내 타 팀까지 확산',
    tags: [
      'stolink', 'spring-boot', 'jpa', 'redis', 'rabbitmq', 'react', 'typescript',
      'canvas', 'postgresql', 'neo4j', 'docker', 'backend', 'fullstack', 'AI연동',
      '보안', 'DX',
    ],
    period: { start: '2025-12', end: '2026-02' },
    projectName: null,
    techStack: [
      { category: 'Frontend', items: ['React', 'TypeScript', 'Canvas (D3.js)'] },
      { category: 'Backend', items: ['Spring Boot', 'JPA (Hibernate)', 'Redis', 'RabbitMQ'] },
      { category: 'Database', items: ['PostgreSQL', 'Neo4j (Graph DB)'] },
      { category: 'Testing & Tools', items: ['JUnit / Vitest', 'Testcontainers', 'Vite', 'Claude Code CLI', 'Antigravity'] },
    ],
    role: '기획, 인증·결제 백엔드 + 에디터·관계도 프론트엔드',
    team: '5인 개발 (크래프톤 정글 최종 프로젝트)',
  },
  {
    type: 'project',
    title: 'Aidiary : AI 기반 산모 감정 일기 서비스',
    summary:
      '산모를 위한 AI 감정 일기 서비스. RabbitMQ 비동기 아키텍처로 1,949 TPS, Redis 다층 캐시, LangGraph AI 챗봇, Docker Compose + AWS 배포.',
    content:
      '산모를 위한 AI 감정 일기 서비스입니다. 일기를 쓰면 AI가 감정을 분석하고 태아가 그려준 듯한 그림 일기로 하루를 요약해주며, 부모의 성격·외모를 바탕으로 만든 아이 캐릭터와 AI 챗봇으로 대화할 수 있습니다.\n\n' +
      'ML 라이브러리(MediaPipe, XLM-R 등) 활용을 위해 Spring Boot + Flask 이중 서버 구조로 분리했습니다.\n\n' +
      '담당 구현:\n' +
      '- Backend: RabbitMQ 메시지 브로커 아키텍처, MediaPipe + LLM 캐릭터 생성 파이프라인, LangGraph 기반 AI 챗봇 대화 흐름 제어\n' +
      '- Frontend: 아이 캐릭터 생성 화면 (이미지 압축, 비동기 대기, 결과 폴링), 임신 주차별 맞춤 큐레이션 화면\n' +
      '- Infra: Docker Compose 6개 서비스 오케스트레이션, AWS EC2 배포, S3/CloudFront CDN, GitHub Actions CI/CD',
    tags: [
      'aidiary', 'spring-boot', 'flask', 'redis', 'rabbitmq', 'react', 'typescript',
      'mariadb', 'docker', 'aws', 'backend', 'fullstack', 'AI연동', '인프라',
    ],
    period: { start: '2025-04', end: '2026-02' },
    projectName: null,
    techStack: [
      { category: 'Frontend', items: ['React', 'TypeScript'] },
      { category: 'Backend', items: ['Spring Boot', 'Flask', 'Redis', 'RabbitMQ'] },
      { category: 'AI/ML', items: ['AI Agent & LLM (LangGraph, Gemini)', 'Vision & NLP (MediaPipe, XLM-R)'] },
      { category: 'Database', items: ['MariaDB'] },
      { category: 'Infra', items: ['AWS (EC2, S3, CloudFront)', 'Messaging (RabbitMQ, Redis)', 'Docker Compose'] },
    ],
    role: '백엔드·인프라 중심 풀스택',
    team: '2인 개발 (캡스톤 디자인 → 개인 개선)',
  },

  // ═══════════════════════════════════════════════════
  // TROUBLESHOOTING — AiDiary
  // ═══════════════════════════════════════════════════
  {
    type: 'troubleshooting',
    title: 'AI 연산 병목 → RabbitMQ 비동기 아키텍처',
    summary:
      'Flask ML 추론(30초) 동기 호출로 Tomcat 스레드 고갈, 서비스 전체 마비(Cascade Failure) → RabbitMQ 메시지 큐 기반 비동기 아키텍처로 재설계. 수동 ACK + DLQ + 3중 멱등성 가드 적용.',
    content:
      '## 문제\nAI 이미지 합성 배포 후 동시 사용자 10~20명에서 서비스 전체 마비. Flask ML 추론(~30초)을 Tomcat I/O 스레드가 동기 대기 → 스레드 풀 고갈.\nk6 실측 최대 처리량: 1.16 TPS.\n\n' +
      '## 1차 시도 — @Async + ConcurrentHashMap\n스레드 고갈은 해결됐으나 두 가지 구조적 한계: Scale-out 불일치(WAS 힙 메모리에 Job 저장 → 수평 확장 불가), 메모리 누수(조회 후 Map에서 제거하지 않는 버그).\n\n' +
      '## 최종 해결 — RabbitMQ 도입\nSpring Boot는 큐 발행 후 즉시 202 Accepted 반환, 독립 Python Worker가 큐 소비 → Webhook 결과 전달.\n- 수동 ACK(auto_ack=False) + DLQ로 Worker 장애 시 메시지 보존\n- at-least-once delivery 대응: Worker → Controller → Store 3중 멱등성 가드\n- Graceful Degradation: 큐 depth ≥ 100이면 429 즉시 반환\n\n' +
      '## 성과\n- WAS TPS: 1.16 → 1,949 TPS\n- 응답 레이턴시: 30,000ms → 4.9ms\n- 극한 부하(500 VU)에서 p(95) 318ms, 에러율 0%',
    tags: ['aidiary', 'spring-boot', 'rabbitmq', 'python', '성능최적화', '비동기처리', '아키텍처', '트러블슈팅', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
    metrics: [
      { label: 'WAS TPS', before: '1.16 TPS', after: '1,949 TPS' },
      { label: '응답 레이턴시', before: '30,000ms', after: '4.9ms' },
      { label: '에러율 (500VU)', before: 'Cascade Failure', after: '0%' },
    ],
  },
  {
    type: 'troubleshooting',
    title: 'JPA 순환 참조 + N+1 → DTO Projection과 계층 책임 분리',
    summary:
      'Diary 엔티티를 API 응답에 직접 반환하면서 StackOverflowError(순환 참조)와 N+1(21쿼리) 동시 발생 → Response DTO 분리 + DTO Projection으로 1쿼리 해결.',
    content:
      '## 문제\n- Jackson 직렬화 시 Diary ↔ User 양방향 순환 참조 → StackOverflowError (서버 다운)\n- FetchType.EAGER로 일기 10건 조회 시 총 21쿼리 (N+1)\n\n' +
      '## 방법 검토\n- @JsonIgnore: 증상 완화일 뿐, 엔티티가 직렬화 라이브러리에 의존\n- Response DTO 분리: 근본 해결\n- DTO Projection: JPQL 쿼리 레벨에서 DTO로 직접 매핑, 엔티티 미생성\n\n' +
      '## 해결\n1. Response DTO 분리 → 순환 참조 구조 자체 제거\n2. FetchType.LAZY 전면 적용 + DTO Projection으로 필요한 컬럼만 SELECT\n3. 소유자 검증 시에만 @EntityGraph로 명시적 Fetch Join\n4. 전역 안전망: default_batch_fetch_size=100\n\n' +
      '## 성과\n쿼리 수 21개 → 1개, StackOverflowError 원천 제거, 응답 크기 4GB+ → 20KB 정상화',
    tags: ['aidiary', 'spring-boot', 'jpa', '성능최적화', '트러블슈팅', 'backend', 'database'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
    metrics: [
      { label: '쿼리 수', before: '21개', after: '1개' },
      { label: '응답 크기', before: '4GB+', after: '20KB' },
    ],
  },
  {
    type: 'troubleshooting',
    title: '외부 AI API 반복 호출 → Redis 날짜 기반 캐싱',
    summary:
      '"오늘의 질문" API가 매 요청마다 Gemini API 호출(avg 487ms) + 사용자마다 다른 질문 생성 → Redis 날짜 키 + 자정 TTL 캐싱으로 일 1회 호출 고정.',
    content:
      '## 문제\n- GET /api/diary-ai/daily-question avg=487ms (다른 API 대비 비정상적)\n- 같은 날인데 사용자마다 다른 질문 → "오늘의 질문" 기능 의미 무너짐\n- 매 요청마다 Flask → Gemini API 동기 호출\n\n' +
      '## 해결\n캐시 키: daily_question:2026-02-28 (날짜 자체가 키)\nTTL: 자정까지 남은 초 → 스케줄러 없이 날짜 변경 시 자동 무효화\nHIT 시 ~1ms, MISS(하루 첫 요청) 시에만 Gemini 호출\n\n' +
      '## 성과\n- 응답시간 487ms → 3ms (162배 단축)\n- Gemini API 호출 N:N → 일 1회 고정\n- 히트율 99.99% (hits: 8,294 / misses: 1)',
    tags: ['aidiary', 'spring-boot', 'redis', '캐싱', '성능최적화', '트러블슈팅', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
    metrics: [
      { label: '응답시간', before: '487ms', after: '3ms' },
      { label: 'API 호출', before: 'N:N (매 요청)', after: '일 1회 고정' },
      { label: '캐시 히트율', before: '0%', after: '99.99%' },
    ],
  },
  {
    type: 'troubleshooting',
    title: '다층 캐시 아키텍처 — Hot Key / Avalanche / Penetration 방어',
    summary:
      '주차별 정보를 AI로 고도화 후 분산 캐시 3가지 장애 패턴 사전 식별 → Caffeine L1 + Redis L2 다층 캐시, TTL Jitter, VALID_WEEKS Set + null 마커로 각 레이어에서 차단.',
    content:
      '## 문제\n임신 주차별 정보를 static HashMap → Gemini AI 12개 필드로 고도화 후 avg 487ms.\n단순 Redis 캐시 추가 전 3가지 잠재 장애 패턴 식별:\n\n' +
      '### Hot Key\n활성 사용자 대다수가 임신 2기(14~27주) 집중 → 소수 키에 편향.\n→ Caffeine L1(JVM 힙 직접 접근, 네트워크 홉 없음) + Redis L2 다층 캐시\n\n' +
      '### Cache Avalanche\nwarmup 후 42개 키 동일 TTL → 동시 만료.\n→ TTL에 random(0, 2h) Jitter 적용\n\n' +
      '### Cache Penetration\nweek=99 같은 무효 요청 반복 → Gemini 비용 발생.\n→ VALID_WEEKS Set O(1) 선차단 + null 마커 5분 캐싱\n\n' +
      '## 구현\n- Caffeine L1: maximumSize(42), expireAfterWrite(2min), W-TinyLFU 알고리즘\n- Redis L2: 24h ± 2h Jitter TTL\n- @EventListener(ApplicationReadyEvent) + @Async 사전 로딩\n\n' +
      '## 성과\n- L2 Redis HIT ~2ms (244배 단축), L1 Caffeine HIT 네트워크 홉 없음\n- Gemini API 호출 일 최대 42회 고정',
    tags: ['aidiary', 'spring-boot', 'redis', 'caffeine', '캐싱', '성능최적화', '아키텍처', '트러블슈팅', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
    metrics: [
      { label: '응답시간', before: '487ms', after: '~2ms (L2) / ~0.1ms (L1)' },
      { label: 'API 호출', before: 'N:N', after: '일 최대 42회' },
      { label: '콘텐츠 필드', before: '7개', after: '12개' },
    ],
  },
  {
    type: 'troubleshooting',
    title: 'Mixed Content 에러 → CloudFront 오리진 통합 + 백엔드 단일 진입점',
    summary:
      '프론트엔드(HTTPS)가 Spring Boot + Flask를 HTTP로 직접 호출 → Mixed Content 차단 → CloudFront SSL Termination + Spring Boot 단일 진입점으로 해결.',
    content:
      '## 문제\n프론트엔드(HTTPS: CloudFront)가 Spring Boot(HTTP:8080)와 Flask(HTTP:5001)를 HTTP로 직접 호출 → 브라우저 Mixed Content 정책에 의해 API 전면 차단.\n\n' +
      '## 방법 검토\n- SSL 인증서 직접 발급: Flask까지 관리 필요, 포인트 증가\n- Nginx 리버스 프록시: 인프라 컴포넌트 추가, 현재 규모에서 과잉\n- CloudFront API 프록시 + 백엔드 단일 진입점: 인프라 추가 없이 코드 변경으로 해결\n\n' +
      '## 해결\n1. CloudFront에 EC2를 오리진으로 추가 → HTTPS 단일 도메인으로 프론트엔드 + API 서빙\n2. 프론트엔드에서 Flask 직접 호출 코드 전면 제거 → Spring Boot 경유로 통일\n3. Flask 포트(5001) 외부 미노출 → 공격 표면 감소\n\n' +
      '## 성과\n- Mixed Content 완전 해결\n- API 엔드포인트 관리 포인트 2개 → 1개 단순화',
    tags: ['aidiary', 'aws', 'cloudfront', '인프라', '보안', '아키텍처', '트러블슈팅', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
  },
  {
    type: 'troubleshooting',
    title: '메모리 누수 탐지 — ConcurrentHashMap Strong Reference',
    summary:
      'k6 부하 테스트 중 힙 메모리가 GC 후에도 반환되지 않는 누수 탐지 → GC Root 분석으로 원인 파악, @Scheduled TTL 기반 정리 스케줄러로 해결.',
    content:
      '## 문제\n비동기 처리 결과를 ConcurrentHashMap에 저장하는 구조에서 소량 테스트만으로도 Heap 메모리 지속 증가. 베이스라인 55.6MB → GC 후 잔류 83.6MB.\n\n' +
      '## 원인\n클라이언트가 결과를 조회한 뒤에도 byte[]를 Map이 Strong Reference로 유지해 GC가 수거하지 못하는 버그.\nGC Root → ImageJobStore(Bean) → store → JobResult → byte[]\n\n' +
      '## 해결\n@Scheduled(fixedRate=60s) TTL 기반 정리 스케줄러. 생성 후 10분 초과 Job을 명시적으로 Map에서 제거. 역방향 맵(jobIdToHash)으로 O(1) 정리.',
    tags: ['aidiary', 'spring-boot', 'java', 'jvm', '트러블슈팅', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
    metrics: [
      { label: '힙 잔류', before: '+28MB 잔류', after: '베이스라인 복귀' },
    ],
  },
  {
    type: 'troubleshooting',
    title: 'AI 챗봇 대화 이탈 방어 — LangGraph 기반 3중 가드레일',
    summary:
      '아이 챗봇의 AI 환각 현상과 대화 이탈 위험을 LangGraph 연쇄 노드 기반 대화 제어와 3중 가드레일로 방어하여 응답 신뢰성 확보.',
    content:
      '## 문제\n아이 캐릭터 AI 챗봇에서 대화가 의도한 맥락을 벗어나거나 AI 환각으로 부적절한 응답이 생성되는 위험.\n\n' +
      '## 해결\nLangGraph 연쇄 노드 기반 대화 제어 + 3중 가드레일:\n1. 의미 검색 강제: 관련 컨텍스트를 반드시 참조하도록 제약\n2. 시스템 프롬프트: 역할과 응답 범위 명시\n3. 입력 검증: 부적절한 입력 사전 차단\n\n' +
      '## 성과\n응답 신뢰성 확보, 대화 이탈 방지',
    tags: ['aidiary', 'AI연동', 'python', '아키텍처', 'backend'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
  },
  {
    type: 'troubleshooting',
    title: 'Web Worker 기반 브라우저 백그라운드 연산 분리',
    summary:
      '모바일에서 Canvas 이미지 압축이 메인 스레드를 점유해 최대 2초 화면 멈춤 → Web Worker 독립 스레드로 분리, Worker 2개 병렬 압축 적용.',
    content:
      '## 문제\n모바일 환경에서 무거운 Canvas 이미지 압축 작업이 메인 스레드를 점유해 최대 2초간 화면이 멈추는 렌더링 차단 현상.\n\n' +
      '## 해결\n브라우저 동작 방식을 고려하여 Web Worker 도입, 독립된 백그라운드 스레드로 연산을 완전히 분리하고 Worker 2개를 활용한 병렬 압축 적용.\n\n' +
      '## 성과\n메인 스레드 점유율을 크게 낮춰 로딩 애니메이션이 끊기지 않는 쾌적한 모바일 사용자 경험 제공.',
    tags: ['aidiary', 'react', 'typescript', '성능최적화', '트러블슈팅', 'frontend', 'web-worker'],
    period: { start: '2025-04', end: '2026-02' },
    projectName: 'aidiary',
  },

  // ═══════════════════════════════════════════════════
  // TROUBLESHOOTING — StoLink
  // ═══════════════════════════════════════════════════
  {
    type: 'troubleshooting',
    title: '크레딧 결제 동시성 제어 + 멱등키',
    summary:
      '순간적 결제 트래픽 폭증이나 중복 요청 시 부당한 크레딧 차감 방지 → 비관적 락 + 멱등키 로직 구성. Testcontainers로 100개 스레드 동시 요청 환경에서 잔액 정합성 100% 검증.',
    content:
      '## 문제\n순간적인 결제 트래픽 폭증이나 네트워크 지연에 따른 중복 요청 시 발생할 수 있는 부당한 크레딧 차감(사용자·비즈니스 금전 손실).\n\n' +
      '## 해결\n토스페이먼츠 연동 크레딧 충전 시스템에 동시성 제어(비관적 락) 및 재시도로 인한 중복 결제 방지(멱등키) 로직 구성.\n\n' +
      '## 검증\nTestcontainers를 활용해 100개 스레드 동시 요청 환경에서 잔액 정합성 100% 보장을 수치로 검증.',
    tags: ['stolink', 'spring-boot', 'jpa', 'postgresql', '동시성제어', '트러블슈팅', '테스트', 'backend'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
    metrics: [
      { label: '잔액 정합성', before: '미검증', after: '100스레드 동시 요청 100%' },
    ],
  },
  {
    type: 'troubleshooting',
    title: 'N+1 쿼리 최적화 — Fetch Join',
    summary:
      '문서 1건 조회 시 태그·카테고리 N개 추가 쿼리 발생 → @ManyToMany LAZY 로딩이 컬렉션 순회 시 개별 쿼리 유발 → Fetch Join 적용, API 응답 450ms → 25ms (18배 개선).',
    content:
      '## 문제\nJPA 쿼리 로그에서 문서 1건 조회 시 태그·카테고리 조회 쿼리가 N개 추가 발생.\n연관관계 분석 결과 @ManyToMany 기본값인 LAZY 로딩이 컬렉션 순회 시점마다 개별 쿼리를 유발하는 것이 원인.\n\n' +
      '## 해결\nFetch Join으로 연관 데이터를 한 번의 쿼리에 함께 조회하도록 개선.\n\n' +
      '## 성과\nAPI 응답 450ms → 25ms (18배 개선).',
    tags: ['stolink', 'spring-boot', 'jpa', '성능최적화', '트러블슈팅', 'backend', 'database'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
    metrics: [
      { label: 'API 응답시간', before: '450ms', after: '25ms' },
    ],
  },
  {
    type: 'troubleshooting',
    title: 'Cross-Domain 인프라 구축 및 보안 개선',
    summary:
      'StoLink/StoRead 도메인 이원화로 쿠키 공유 장애 → SameSite/Secure 쿠키 정책 + CloudFront 라우팅. Access/Refresh Token을 HttpOnly Cookie로 변경하여 XSS 방어.',
    content:
      '## 문제\nStoLink와 StoRead의 도메인 이원화로 인한 쿠키 공유 장애.\n기존 JavaScript 접근이 가능한 방식의 토큰 노출 위험.\n\n' +
      '## 해결\n1. SameSite/Secure 쿠키 정책 수립 및 CloudFront 라우팅 최적화로 OAuth2 기반 통합 인증 환경 구축\n2. Access/Refresh Token을 HttpOnly Cookie에 저장 → XSS 공격 방어 체계 확립\n\n' +
      '## 성과\n크로스 도메인 인증 통합, XSS 방어 체계 확립.',
    tags: ['stolink', 'spring-boot', 'aws', 'cloudfront', '보안', '인프라', '트러블슈팅', 'backend'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
  },
  {
    type: 'troubleshooting',
    title: 'SVG → Canvas 전환으로 관계도 렌더링 병목 해소',
    summary:
      'SVG 기반 관계도에서 노드가 늘어날수록 DOM 수가 비례 증가하여 레이아웃 비용이 커지는 문제 발견 → Canvas API로 전환하여 INP 420ms → 64ms, 650+ 노드에서 60FPS 유지.',
    content:
      '## 문제\nSVG 기반 관계도는 노드·엣지 각각이 DOM 요소로 존재하여, 노드가 늘어날수록 Style Recalculation → Layout → Paint 비용이 비례 증가. 650+ 노드 환경에서 인터랙션이 눈에 띄게 느려졌습니다.\n\n' +
      '## 해결\nCanvas API로 전환하여 렌더링을 단일 비트맵 레이어로 처리. DOM 요소 수에 비례하는 레이아웃 비용을 제거했습니다.\n\n' +
      '## 성과\nINP 420ms → 64ms, 650+ 노드 환경에서 60FPS 유지.',
    tags: ['stolink', 'react', 'canvas', 'typescript', '성능최적화', '트러블슈팅', 'frontend'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
    metrics: [
      { label: 'INP', before: '420ms', after: '64ms' },
      { label: '노드 환경', before: '대규모 노드에서 버벅임', after: '650+ 노드 60FPS' },
    ],
  },
  {
    type: 'troubleshooting',
    title: '알고리즘 최적화 — 문서 배열 → 트리 구조 변환',
    summary:
      '1차원 문서 배열을 트리 구조로 변환 시 렌더링 지연(~20ms) → HashMap 도입, 탐색 복잡도 O(n²) → O(n), 연산 속도 1ms 이하로 단축.',
    content:
      '## 문제\n1차원 문서 배열을 트리 구조로 변환 시 발생하는 렌더링 지연(~20ms).\n\n' +
      '## 해결\n문서 ID 파싱용 HashMap 도입으로 탐색 복잡도를 O(n²)에서 O(n)으로 개선.\n\n' +
      '## 성과\n연산 속도 1ms 이하로 단축.',
    tags: ['stolink', 'react', 'typescript', '성능최적화', 'frontend'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
    metrics: [
      { label: '탐색 복잡도', before: 'O(n²)', after: 'O(n)' },
      { label: '연산 속도', before: '~20ms', after: '< 1ms' },
    ],
  },
  {
    type: 'troubleshooting',
    title: '번들링/UX 최적화 — 청크 분할 및 지연 로딩',
    summary:
      '무거운 문서 내보내기 라이브러리가 초기 번들에 함께 묶이는 병목 → Vite 코드 분할 + hover 시점 사전 로딩, 초기 번들 450KB → 187KB (58% 감소).',
    content:
      '## 문제\n초기 로딩 시 무거운 문서 내보내기 라이브러리가 함께 묶여 번들 크기가 커지는 병목.\n\n' +
      '## 해결\nVite를 활용해 코드를 분할하고, 사용자가 버튼에 마우스를 올릴 때 필요한 파일만 미리 불러오도록 구현.\n\n' +
      '## 성과\n초기 번들 사이즈 450KB → 187KB (58% 감소).',
    tags: ['stolink', 'react', 'typescript', 'vite', '성능최적화', 'frontend'],
    period: { start: '2025-12', end: '2026-02' },
    projectName: 'stolink',
    metrics: [
      { label: '초기 번들 사이즈', before: '450KB', after: '187KB (58% 감소)' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════
  {
    type: 'experience',
    title: '맥도날드 팀 리더',
    summary:
      '입사 1년 차 팀 리더 승진. 시프트 단위 최대 20명 크루 지휘, 피크 시간 병목 판단 및 인력 재배치, 고객 컴플레인·팀원 간 갈등 중재, 신규 크루 교육 담당.',
    content:
      '- 입사 1년 차에 팀 리더로 승진하여 시프트 단위 최대 20명의 크루를 지휘\n' +
      '- 피크 시간에 병목 구간을 판단하고 인력을 재배치하여 운영\n' +
      '- 고객 컴플레인, 팀원 간 갈등 등 현장 이슈를 직접 중재하고 해결\n' +
      '- 신규 크루 교육을 담당하고, 어려움을 겪는 동료에게 강점에 맞는 역할을 배정하여 팀 적응을 지원',
    tags: ['리더십', '커뮤니케이션', '팀워크'],
    period: { start: '2022-11', end: '2025-09' },
    projectName: null,
    company: '맥도날드 순천 조례 DT점',
    position: '크루, 팀 리더',
  },

  // ═══════════════════════════════════════════════════
  // SKILLS
  // ═══════════════════════════════════════════════════
  // Frontend
  {
    type: 'skill',
    title: 'TypeScript',
    summary: '타입 시스템으로 런타임 오류를 줄이고 협업 시 코드 의도를 명확히 전달하는 데 활용.',
    content: '타입 시스템으로 런타임 오류를 줄이고 협업 시 코드 의도를 명확히 전달하는 데 활용.',
    tags: ['typescript', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'JavaScript',
    summary: 'ES6+ 비동기 처리, DOM API 활용.',
    content: 'ES6+ 비동기 처리, DOM API 활용.',
    tags: ['javascript', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'React',
    summary: '컴포넌트 생명주기와 렌더링 최적화 이해. Canvas, Web Worker를 활용한 UI 병목 해결 경험.',
    content: '컴포넌트 생명주기와 렌더링 최적화를 이해합니다. 대규모 시각화(Canvas)나 백그라운드 연산(Web Worker)을 활용해 UI 병목을 해결한 경험이 있습니다.',
    tags: ['react', 'frontend', 'canvas', 'web-worker'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'Next.js',
    summary: 'SSR/SSG 특성을 활용한 성능 최적화 및 Vercel 기반 배포 파이프라인 구축.',
    content: 'SSR/SSG 특성을 활용한 성능 최적화 및 Vercel 기반 배포 파이프라인 구축.',
    tags: ['nextjs', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'Zustand',
    summary: '도메인별 스토어 분리를 통한 전역 상태 관리.',
    content: '도메인별 스토어 분리를 통한 전역 상태 관리.',
    tags: ['zustand', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'TanStack Query',
    summary: '서버 상태 동기화 및 낙관적 업데이트 적용.',
    content: '서버 상태 동기화 및 낙관적 업데이트 적용.',
    tags: ['tanstack-query', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  {
    type: 'skill',
    title: 'Tailwind CSS',
    summary: '반응형 UI 구현.',
    content: '반응형 UI 구현.',
    tags: ['tailwind', 'frontend'],
    period: null,
    category: 'Frontend',
  },
  // Backend
  {
    type: 'skill',
    title: 'Java',
    summary: '주력 언어. 객체 지향 원칙을 준수하며 Spring Boot 기반의 안정적인 서버 개발.',
    content: '주력 언어. 객체 지향 원칙을 준수하며 Spring Boot 기반의 안정적인 서버를 개발합니다.',
    tags: ['java', 'backend'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'Spring Boot',
    summary: 'Layered Architecture 기반 REST API 개발 및 JWT 인증 활용.',
    content: 'Layered Architecture 기반 REST API 개발 및 JWT 인증 활용.',
    tags: ['spring-boot', 'java', 'backend'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'Spring Data JPA',
    summary: 'N+1 문제를 Fetch Join + In-Memory 트리 조립으로 해결 (450ms → 25ms).',
    content: 'N+1 문제를 Fetch Join + In-Memory 트리 조립으로 해결 (450ms → 25ms).',
    tags: ['jpa', 'spring-boot', 'backend', 'database'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'RabbitMQ',
    summary: 'AI 연산량 폭증 시 동기 블로킹 문제를 비동기 큐로 전환하여 장애 격리.',
    content: 'AI 연산량 폭증 시 동기 블로킹 문제를 비동기 큐로 전환하여 장애 격리.',
    tags: ['rabbitmq', 'backend', '비동기처리'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'Redis',
    summary: '날짜 키 기반 TTL 캐싱으로 API 호출 비용 절감 및 다층 캐시 구성.',
    content: '날짜 키 기반 TTL 캐싱으로 API 호출 비용 절감 및 다층 캐시 구성.',
    tags: ['redis', 'backend', '캐싱'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'Node.js',
    summary: '비동기 이벤트 루프 기반의 서버 환경 이해.',
    content: '비동기 이벤트 루프 기반의 서버 환경 이해.',
    tags: ['nodejs', 'backend'],
    period: null,
    category: 'Backend',
  },
  {
    type: 'skill',
    title: 'Python',
    summary: 'Flask 기반 AI 모델 서빙 및 MediaPipe·PyTorch 활용.',
    content: 'Flask 기반 AI 모델 서빙 및 MediaPipe·PyTorch 활용.',
    tags: ['python', 'flask', 'backend', 'AI연동'],
    period: null,
    category: 'Backend',
  },
  // Database & Infra
  {
    type: 'skill',
    title: 'PostgreSQL / MariaDB',
    summary: '비관적 락으로 결제 동시성 제어 및 인덱스 설계.',
    content: '비관적 락으로 결제 동시성 제어 및 인덱스 설계.',
    tags: ['postgresql', 'mariadb', 'database', 'backend'],
    period: null,
    category: 'Database & Infra',
  },
  {
    type: 'skill',
    title: 'Neo4j',
    summary: 'Cypher 쿼리를 활용한 그래프 데이터 모델링 및 조회.',
    content: 'Cypher 쿼리를 활용한 그래프 데이터 모델링 및 조회.',
    tags: ['neo4j', 'database'],
    period: null,
    category: 'Database & Infra',
  },
  {
    type: 'skill',
    title: 'Docker',
    summary: 'Docker Compose로 멀티 컨테이너 개발/배포 환경 구성.',
    content: 'Docker Compose로 멀티 컨테이너 개발/배포 환경 구성.',
    tags: ['docker', '인프라'],
    period: null,
    category: 'Database & Infra',
  },
  {
    type: 'skill',
    title: 'AWS',
    summary: 'EC2 배포, S3/CloudFront CDN 구성, GitHub Actions CI/CD 파이프라인 구축.',
    content: 'EC2 배포, S3/CloudFront CDN 구성, GitHub Actions CI/CD 파이프라인 구축.',
    tags: ['aws', 'cloudfront', '인프라'],
    period: null,
    category: 'Database & Infra',
  },
  // Tools
  {
    type: 'skill',
    title: 'Git / GitHub',
    summary: '브랜치 전략, PR 기반 코드 리뷰, GitHub Actions CI/CD.',
    content: '브랜치 전략, PR 기반 코드 리뷰, GitHub Actions CI/CD.',
    tags: ['git', 'DX'],
    period: null,
    category: 'Tools',
  },
  {
    type: 'skill',
    title: 'Claude Code / Antigravity',
    summary: 'AI 에이전트 워크플로우를 설계해 개발 생산성을 극대화.',
    content: 'AI 에이전트 워크플로우를 설계해 개발 생산성을 극대화합니다.',
    tags: ['AI연동', 'DX'],
    period: null,
    category: 'Tools',
  },

  // ═══════════════════════════════════════════════════
  // EDUCATION
  // ═══════════════════════════════════════════════════
  {
    type: 'education',
    title: '연암공과대학교 — 전공심화과정 (학사)',
    summary: '스마트소프트웨어학과 전공심화과정 (학사) 졸업 예정.',
    content: '스마트소프트웨어학과 전공심화과정 (학사) 졸업 예정.',
    tags: [],
    period: { start: '2025-03', end: '2027-02' },
    projectName: null,
    institution: '연암공과대학교',
    degree: '스마트소프트웨어학과 전공심화과정 (학사) 졸업 예정',
  },
  {
    type: 'education',
    title: '연암공과대학교 — 전문학사',
    summary: '스마트소프트웨어학과 전문학사 졸업.',
    content: '스마트소프트웨어학과 전문학사 졸업.',
    tags: [],
    period: { start: '2017-03', end: '2025-02' },
    projectName: null,
    institution: '연암공과대학교',
    degree: '스마트소프트웨어학과 전문학사 졸업',
  },

  // ═══════════════════════════════════════════════════
  // ACTIVITIES
  // ═══════════════════════════════════════════════════
  {
    type: 'activity',
    title: '크래프톤 정글 (Krafton Jungle) 11기',
    summary: '5개월간 주당 100시간 몰입 — 자료구조, 알고리즘, Pintos OS 커널 구현 등 CS 기초 학습.',
    content:
      '5개월간 주당 100시간 몰입 — 자료구조, 알고리즘, Pintos OS 커널 구현 등 단단한 CS 기초 학습.\n' +
      '크래프톤 정글 최종 프로젝트로 StoLink & StoRead 개발.',
    tags: ['backend', '알고리즘'],
    period: { start: '2025-09', end: '2026-01' },
    projectName: null,
  },
  {
    type: 'activity',
    title: 'Rise 캡스톤 디자인 경진대회 참여',
    summary: 'AI 기반 산모 감정 일기 "Aidiary" 기획 및 풀스택 개발.',
    content: 'AI 기반 산모 감정 일기 "Aidiary" 기획 및 풀스택 개발.',
    tags: ['aidiary', 'fullstack'],
    period: { start: '2025-04', end: '2025-06' },
    projectName: null,
  },
  {
    type: 'activity',
    title: '창의 융합 캡스톤 디자인 경진대회 참여',
    summary: '라즈베리 파이를 활용한 미니 게임기 프로젝트 기획 및 하드웨어/SW 연동 구현.',
    content: '라즈베리 파이를 활용한 미니 게임기 프로젝트 기획 및 하드웨어/SW 연동 구현.',
    tags: ['python'],
    period: { start: '2024-09', end: '2025-01' },
    projectName: null,
  },
  {
    type: 'activity',
    title: '전공 멘토링 활동 (Java/HTML)',
    summary: '후배 대상 주간 학습 가이드 제공 및 실습 멘토링.',
    content: '후배 대상 주간 학습 가이드 제공 및 실습 멘토링.',
    tags: ['java', '멘토링', '리더십'],
    period: { start: '2020-09', end: '2020-12' },
    projectName: null,
  },
];
