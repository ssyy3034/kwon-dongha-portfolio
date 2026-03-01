import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 작가를 위한 세컨드 브레인 서비스입니다. 에디터에서 집필하면 AI가 글을 분석하고, 월드 페이지에서 인물·관계·사건을 시각화합니다.",
    overview:
      "5인 팀 프로젝트. 프론트엔드 전체와 백엔드 일부(인증·문서 CRUD·결제)를 담당했습니다. 인물 관계도 응답속도 420ms → 64ms, 초기 번들 58% 절감, 결제 시스템 3중 동시성 방어를 구현했습니다.",

    sections: {
      backend: [
        {
          id: "n1-query",
          title: "계층형 문서 조회 N+1 쿼리",
          subtitle: "API 응답 450ms → 25ms (18배 개선)",
          problem:
            "대량의 계층형 문서 데이터를 조회할 때 태그와 카테고리 로딩에서 N+1 쿼리가 발생했습니다. 문서 목록 조회 한 번에 수십 개의 추가 쿼리가 실행되어 API 응답이 450ms에 달했습니다.",
          approach:
            "JPA의 Fetch Join과 DTO Projection을 함께 적용했습니다. Fetch Join으로 연관 데이터를 한 번에 로딩하고, 엔티티 대신 DTO로 직접 조회하여 불필요한 컬럼 로딩을 제거했습니다.",
          result:
            "API 응답 450ms → 25ms, 18배 개선. 추가 쿼리 수십 개가 단일 쿼리로 통합됐습니다.",
          retrospective:
            "초기 설계 시 N+1 문제를 고려하지 않아 리팩토링에 시간이 들었습니다. 처음부터 DTO Projection 기반으로 설계했다면 더 효율적이었을 것입니다. 향후 QueryDSL 도입으로 타입 안전한 쿼리 작성이 가능합니다.",
          details: [
            "문서·태그·카테고리 연관 관계를 Fetch Join으로 단일 쿼리로 통합",
            "엔티티 반환 대신 DTO Projection으로 필요한 컬럼만 조회",
            "계층형 폴더 구조는 Recursive CTE로 단일 쿼리 트리 조회 구현",
          ],
          impact: "450ms → 25ms (18배)",
        },
        {
          id: "connection-pool",
          title: "결제 PG 외부 API 호출로 인한 DB 커넥션 풀 고갈",
          subtitle: "결제 시스템 장애 격리",
          problem:
            "결제 승인 시 외부 PG사(토스페이먼츠) API를 호출하는 동안 DB 트랜잭션이 열린 채로 대기했습니다. 외부 API 응답이 느려지면 커넥션 풀이 빠르게 소진되어 전체 시스템에 장애가 전파되는 문제를 발견했습니다.",
          approach:
            "네트워크 I/O를 트랜잭션 범위 밖으로 분리했습니다. 외부 PG API 호출을 트랜잭션 시작 전에 먼저 수행하고, 성공 응답을 받은 후에만 DB 트랜잭션을 열어 크레딧을 처리하는 순서로 변경했습니다.",
          result:
            "외부 PG 지연이 커넥션 풀에 영향을 주지 않게 됐습니다. 결제 시스템 장애가 다른 API에 전파되지 않는 구조를 확보했습니다.",
          retrospective:
            "분산 환경을 고려한 추가 부하 테스트를 충분히 하지 못했습니다. 향후 Resilience4j Circuit Breaker를 적용해 PG사 장애 시 빠른 실패와 사용자 안내 메시지를 제공하는 방향이 더 견고합니다.",
          details: [
            "외부 API 호출을 @Transactional 범위 밖으로 이동",
            "PG 승인 성공 후 DB 작업 시작 → 커넥션 점유 시간 최소화",
            "실패 시 PG사 측 취소 API 호출로 정합성 보장",
          ],
          impact: "커넥션 풀 고갈 방지, 결제 장애 격리",
        },
        {
          id: "concurrency",
          title: "결제 동시성 제어와 멱등성 보장",
          subtitle: "100 스레드 동시 요청 / 잔액 정합성 100% 검증",
          problem:
            "트래픽 폭증이나 네트워크 지연 시 중복 결제 요청이 들어올 경우, 크레딧이 중복 차감되어 사용자와 서비스 모두에게 금전 손실이 발생할 수 있었습니다. 동시에 여러 요청이 같은 잔액을 읽고 차감하는 경쟁 조건이 문제였습니다.",
          approach:
            "3중 방어 레이어를 설계했습니다. ① 비관적 락으로 잔액 조회 시 행 수준 잠금, ② 낙관적 락으로 잔액 변경 시 버전 충돌 감지, ③ 멱등키로 재시도 요청이 중복 처리되지 않도록 차단. Testcontainers로 실제 DB를 띄워 100개 스레드 동시 요청 환경에서 검증했습니다.",
          result:
            "100 스레드 동시 요청 시나리오에서 잔액 정합성 100% 보장을 수치로 확인했습니다. 동일 멱등키로 들어오는 중복 결제는 DB에 도달하기 전에 차단됩니다.",
          retrospective:
            "비관적 락과 낙관적 락을 함께 쓰는 구조가 복잡합니다. 서비스 규모가 커지면 Redis 기반 분산 락으로 단순화하거나, 결제 처리를 별도 서비스로 분리하는 방향이 더 깔끔할 것 같습니다.",
          details: [
            "비관적 락(SELECT FOR UPDATE): 잔액 조회 시 행 수준 잠금",
            "낙관적 락(Version): 동시 업데이트 충돌 감지 후 재시도",
            "멱등키: 동일 요청 재시도 시 DB 진입 전 중복 감지",
            "Testcontainers: 실제 PostgreSQL 컨테이너로 100 스레드 부하 테스트",
          ],
          impact: "100 스레드 / 잔액 정합성 100%",
        },
      ],
      frontend: [
        {
          id: "d3-canvas",
          title: "인물 관계도 성능 개선 (React Flow → D3.js + Canvas)",
          subtitle: "420ms → 64ms (6.5배)",
          problem:
            "React Flow로 인물 관계도를 만들었는데 등장인물이 늘어날수록 SVG DOM이 기하급수적으로 증가하며 렌더링이 멈췄습니다. 인물 간 자연스러운 배치를 위한 물리 연산도 React 생명주기와 맞지 않았습니다.",
          approach:
            "React Flow를 제거하고 D3.js Force Simulation + Canvas API로 교체했습니다. Canvas는 DOM을 만들지 않고 픽셀을 직접 그리기 때문에 노드 수에 관계없이 일정한 성능을 냅니다. D3.js의 물리 시뮬레이션 상태를 useRef로 React 렌더링 사이클 밖에 분리하고, 시뮬레이션/드래그/줌/리사이즈를 각각 독립 훅으로 분리했습니다.",
          result:
            "등장인물 650명 기준 응답속도 420ms → 64ms, 6.5배 개선. 물리 엔진으로 인물 간 관계에 따라 자연스럽게 배치됩니다.",
          retrospective:
            "Canvas는 SVG와 달리 접근성(스크린 리더)을 직접 구현해야 합니다. 현재는 미지원 상태이며, 향후 ARIA 레이블을 Canvas 위에 오버레이하는 방식으로 개선이 필요합니다.",
          details: [
            "SVG DOM → Canvas 픽셀 렌더링: 노드 수 증가에 선형 대응",
            "D3 시뮬레이션을 useRef로 격리: React 리렌더링과 물리 연산 분리",
            "훅 분리: useSimulation / useDrag / useZoom / useResize 독립 관리",
          ],
          codeSnippet: `// useCharacterGraphSimulation.ts
const simulation = d3
  .forceSimulation<CharacterNode>(nodes)
  .force("charge", d3.forceManyBody().strength(-300))
  .force("collision", d3.forceCollide().radius(d => getNodeRadius(d) + 5))
  .alphaDecay(0.02);

// React 렌더링과 물리 연산 분리
const simulationRef = useRef(simulation);`,
          impact: "420ms → 64ms (6.5배)",
        },
        {
          id: "bundle-split",
          title: "초기 번들 최적화 (450KB → 187KB)",
          subtitle: "첫 화면 로딩 속도 58% 개선",
          problem:
            "초기 JS 번들이 450KB(gzip)였습니다. 대부분의 사용자가 쓰지 않는 Export 기능에 쓰이는 jspdf, docx 같은 무거운 라이브러리가 서비스 진입 시 전부 로드되고 있었습니다.",
          approach:
            "Vite manualChunks로 라이브러리를 용도별 청크로 분리했습니다. 항상 필요한 것(React, UI 컴포넌트)과 특정 시점에만 필요한 것(Export, Graph)을 나누고, 라우트 호버 시 prefetch를 걸어 코드 스플리팅 지연감을 최소화했습니다.",
          result:
            "초기 번들 450KB → 187KB, 58% 절감. Export 라이브러리는 실제 사용 시점에만 로드됩니다.",
          retrospective:
            "청크 분리 기준이 라이브러리 단위라 세밀한 조정이 어렵습니다. 향후 Rollup Visualizer로 모듈 단위 분석을 하면 더 정밀한 최적화 여지가 있습니다.",
          details: [
            "vendor-react, vendor-ui: 항상 로드 (핵심 런타임)",
            "vendor-export (jspdf, docx), vendor-graph (d3): 필요 시 로드",
            "라우트 호버 prefetch: 코드 스플리팅 지연감 최소화",
          ],
          impact: "450KB → 187KB (58% 절감)",
        },
        {
          id: "tiptap-stability",
          title: "Tiptap 에디터 한글 입력 끊김",
          subtitle: "커서 튐과 글자 씹힘 해결",
          problem:
            "타이핑 중 커서가 튀거나 한글이 씹히는 현상이 발생했습니다. 부모 컴포넌트가 리렌더링될 때마다 useEditor의 의존성 배열에 있는 props가 변경되어 에디터 인스턴스가 재생성되는 것이 원인이었습니다.",
          approach:
            "onUpdate 콜백을 useRef로 감싸서 인스턴스는 유지하면서 콜백만 갱신했습니다. useEditor의 의존성 배열에서 자주 바뀌는 props를 제거하여 인스턴스가 재생성되지 않도록 했습니다.",
          result:
            "커서 튐과 한글 입력 끊김이 사라졌습니다. 리렌더링이 발생해도 에디터 상태가 유지됩니다.",
          retrospective:
            "증상을 쫓아 수정했지만 ProseMirror 내부의 Composition Event 처리까지는 완전히 파악하지 못했습니다. 더 근본적인 이해를 바탕으로 접근했다면 더 안정적인 해결책을 설계할 수 있었을 것입니다.",
          codeSnippet: `// TiptapEditor.tsx - 인스턴스 재생성 방지
const onUpdateRef = useRef(onUpdate);
useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

const editor = useEditor({
  extensions,
  onUpdate: ({ editor }) => {
    onUpdateRef.current?.(editor.state.doc.textContent.length);
  },
});`,
          impact: "커서 튐 / 한글 씹힘 해결",
        },
      ],
    },

    achievements: [
      {
        metric: "450ms → 25ms",
        label: "문서 조회 API",
        description: "N+1 해소, 18배 개선",
      },
      {
        metric: "100스레드 / 100%",
        label: "결제 잔액 정합성",
        description: "Testcontainers 동시성 검증",
      },
      {
        metric: "420ms → 64ms",
        label: "인물 관계도",
        description: "SVG → Canvas, 6.5배 개선",
      },
      {
        metric: "450KB → 187KB",
        label: "초기 JS 번들",
        description: "58% 절감",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: ["React 19", "TypeScript", "Vite", "D3.js", "Canvas API", "Tiptap", "Zustand", "TanStack Query"],
      },
      {
        category: "Backend",
        items: ["Spring Boot", "JPA", "PostgreSQL", "Neo4j"],
      },
      {
        category: "결제 & 테스트",
        items: ["Toss Payments SDK", "JUnit 5", "Testcontainers"],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "산모가 일기를 쓰면 AI가 감정을 분석해 피드백을 제공하는 서비스입니다. 부모 사진으로 아기 캐릭터를 생성하는 기능도 함께 제공합니다.",
    overview:
      "2인 팀 프로젝트 (캡스톤 디자인 → 수료 후 개인 개선). 백엔드 전체와 프론트엔드 일부를 담당했습니다. RabbitMQ 도입으로 WAS 수락률 1,949 TPS 달성, Redis 캐싱으로 응답 487ms → 3ms 개선을 이끌었습니다.",

    sections: {
      backend: [
        {
          id: "rabbitmq-async",
          title: "ML 이미지 합성 동기 블로킹 → RabbitMQ 비동기 처리",
          subtitle: "WAS 수락률 1.16 → 1,949 TPS",
          problem:
            "AI 이미지 합성(~30초)이 동기로 처리되어 WAS 전체가 마비됐습니다. 요청 한 건이 처리되는 동안 다른 모든 요청이 블로킹되었고, 동시 사용자가 조금만 늘어도 서비스 전체가 응답 불가 상태가 됐습니다.",
          approach:
            "@Async를 먼저 시도했지만 Scale-out 시 태스크 유실과 메모리 누수를 확인했습니다. RabbitMQ로 재설계했습니다. WAS가 큐에 메시지만 발행하고 즉시 응답하면, 독립 Python Worker가 큐를 소비해 AI 처리 후 Webhook으로 결과를 전달합니다. DLQ와 멱등성 가드로 실패 복구와 중복 처리도 방어했습니다.",
          result:
            "WAS 수락률 1.16 → 1,949 TPS, 500 VU 환경에서 p(95) 318ms, 에러율 0%. AI 처리와 비즈니스 로직이 완전히 분리됐습니다.",
          retrospective:
            "Webhook 방식은 클라이언트가 폴링해야 하는 부담이 있습니다. WebSocket이나 SSE로 서버 푸시를 구현하면 폴링 트래픽을 없애고 사용자 경험도 개선할 수 있습니다. 또 Worker 프로세스 모니터링 체계가 부족해 장애 감지가 늦을 수 있습니다.",
          details: [
            "Producer(Spring Boot): 큐에 작업 메시지 발행 후 즉시 200 응답",
            "Consumer(Python Worker): 독립 프로세스, 큐 소비 → AI 처리 → Webhook",
            "DLQ: 처리 실패 메시지 별도 보관, 수동 재처리 가능",
            "멱등성 가드 3중: DB 상태 확인 + Redis 처리 키 + 요청 ID 검증",
          ],
          diagram: {
            type: "mermaid",
            content: `sequenceDiagram
  Client->>+WAS: 이미지 합성 요청
  WAS->>RabbitMQ: 메시지 발행
  WAS-->>-Client: 202 Accepted (즉시 응답)
  RabbitMQ->>+Worker: 메시지 소비
  Worker->>Worker: AI 처리 (~30s)
  Worker->>-WAS: Webhook (결과 전달)`,
            caption: "RabbitMQ 비동기 처리 흐름",
          },
          impact: "1.16 → 1,949 TPS",
        },
        {
          id: "n1-circular",
          title: "JPA N+1 + 순환 참조",
          subtitle: "쿼리 21개 → 1개, StackOverflowError 해결",
          problem:
            "일기 목록(10건) 조회 시 21개 쿼리가 발생했고, 엔티티를 직렬화하는 과정에서 양방향 관계를 따라가며 순환 참조 StackOverflowError가 발생했습니다. 두 문제가 엮여 API 자체가 응답하지 않는 상황이었습니다.",
          approach:
            "엔티티 반환 대신 DTO Projection으로 전환했습니다. JPQL에서 필요한 컬럼만 DTO로 직접 매핑하여 N+1을 단일 쿼리로 통합하고, 순환 참조 구조 자체를 제거했습니다.",
          result:
            "쿼리 21개 → 1개, 순환 참조 오류 해결. API가 정상 응답하게 됐습니다.",
          retrospective:
            "JPA 엔티티를 API 응답 레이어까지 그대로 노출하는 패턴의 위험성을 직접 경험했습니다. 애초에 DTO Projection과 단방향 관계를 기본으로 설계했으면 두 문제 모두 발생하지 않았을 것입니다.",
          details: [
            "JPQL + DTO 생성자 표현식으로 필요 컬럼만 조회",
            "연관 관계 Fetch Join으로 N+1 단일 쿼리 처리",
            "양방향 매핑 제거로 순환 참조 구조 자체를 없앰",
          ],
          impact: "쿼리 21개 → 1개",
        },
        {
          id: "redis-cache",
          title: "오늘의 질문 매 요청 Gemini API 호출 → Redis 캐싱",
          subtitle: "응답 487ms → 3ms (히트율 99.99%)",
          problem:
            "오늘의 질문 기능이 매 요청마다 Gemini API를 호출하고 있었습니다. 응답 시간이 487ms에 달했고, 같은 날짜인데도 사용자마다 다른 질문이 생성되는 기능 결함도 있었습니다.",
          approach:
            "날짜를 Redis 키로 사용하고 자정 TTL을 설정해 캐싱했습니다. 첫 요청에만 Gemini API를 호출하고 그 결과를 당일 모든 사용자가 공유합니다. 추가로 주차별 정보에는 Caffeine L1 + Redis L2 다층 캐시를 적용하고, Cache Avalanche·Cache Penetration 방어를 설계했습니다.",
          result:
            "응답 487ms → 3ms, 히트율 99.99%. 같은 날 모든 사용자에게 동일한 질문이 제공되는 기능 결함도 함께 수정됐습니다.",
          retrospective:
            "자정에 캐시가 동시에 만료되면 순간적으로 다수의 API 호출이 몰리는 Thundering Herd 가능성이 있습니다. 캐시 워밍업 스케줄러나 랜덤 TTL 편차 방식으로 보완할 수 있습니다.",
          details: [
            "날짜 키 + 자정 TTL: 당일 첫 요청만 Gemini API 호출",
            "Caffeine L1 + Redis L2: 주차별 정보 다층 캐시",
            "Cache Penetration 방어: Null 캐싱으로 DB 직접 조회 차단",
          ],
          impact: "487ms → 3ms (히트율 99.99%)",
        },
      ],
      frontend: [
        {
          id: "web-worker",
          title: "이미지 압축 메인 스레드 블로킹 → Web Worker",
          subtitle: "UI Freezing(최대 2초) 해소",
          problem:
            "부모 사진 업로드 시 메인 스레드에서 Canvas로 이미지를 압축하면서 UI가 최대 2초간 멈추는 Freezing이 발생했습니다. 로딩 애니메이션도 멈춰서 사용자는 앱이 죽었다고 오해할 수 있었습니다.",
          approach:
            "이미지 압축 로직을 Web Worker로 분리했습니다. 메인 스레드는 UI 렌더링만 담당하고, 두 Worker가 부모 사진을 병렬 압축합니다. 압축 완료 시 postMessage로 결과를 전달받습니다.",
          result:
            "UI Freezing이 해소됐습니다. 압축 중에도 로딩 애니메이션이 정상 동작하고 모바일에서도 매끄럽게 동작합니다.",
          retrospective:
            "Worker 2개를 고정 생성하는 방식이라 사진이 1장일 때 Worker 낭비가 생깁니다. 사진 수에 따라 Worker 수를 동적 조절하거나 Worker Pool을 사용하는 방향이 더 효율적입니다.",
          details: [
            "Canvas 압축 로직을 별도 Worker 파일로 분리",
            "Worker 2개 병렬 실행: 아빠/엄마 사진 동시 압축",
            "압축 완료 시 postMessage → 메인 스레드에서 결과 수신",
          ],
          impact: "UI Freezing 해소 (최대 2초 → 0)",
        },
        {
          id: "zustand-hooks",
          title: "useState·전역 상태 혼재 → Zustand + 커스텀 훅",
          subtitle: "View와 비즈니스 로직 분리",
          problem:
            "useState와 전역 상태가 혼재되어 같은 상태를 여러 컴포넌트가 중복 관리했습니다. Prop Drilling이 깊어지면서 코드 추적이 어렵고 버그 재현이 힘들었습니다.",
          approach:
            "Zustand로 전역 상태(사용자 세션, 모달 등)를 일원화하고, 비즈니스 로직은 useCharacter, useDiary 등 커스텀 훅으로 분리했습니다. View 컴포넌트는 렌더링에만 집중하게 했습니다.",
          result:
            "중복 상태 제거, Prop Drilling 해소. 기능 추가 시 기존 컴포넌트를 건드리는 빈도가 줄었습니다.",
          retrospective:
            "Zustand 스토어를 하나로 만들어 비대해지는 문제가 생겼습니다. 처음부터 useUserStore, useDiaryStore처럼 도메인 단위로 분리했다면 관리가 더 편했을 것입니다.",
          details: [
            "Zustand 전역 스토어로 사용자 세션·모달 상태 일원화",
            "useCharacter, useDiary 커스텀 훅으로 비즈니스 로직 캡슐화",
            "View 컴포넌트는 훅을 호출하고 결과만 렌더링",
          ],
          impact: "중복 상태 제거, 관심사 분리",
        },
      ],
    },

    achievements: [
      {
        metric: "1.16 → 1,949 TPS",
        label: "WAS 수락률",
        description: "RabbitMQ 비동기 전환, 500 VU / p95 318ms",
      },
      {
        metric: "487ms → 3ms",
        label: "오늘의 질문 API",
        description: "Redis 캐싱, 히트율 99.99%",
      },
      {
        metric: "21쿼리 → 1쿼리",
        label: "일기 목록 조회",
        description: "DTO Projection + N+1 해소",
      },
      {
        metric: "2초 → 0",
        label: "이미지 압축 Freezing",
        description: "Web Worker 병렬 처리",
      },
    ],

    techStack: [
      {
        category: "Backend",
        items: ["Spring Boot", "JPA", "MariaDB", "RabbitMQ", "Redis"],
      },
      {
        category: "AI / Infra",
        items: ["Flask", "MediaPipe", "Gemini 2.5 Flash", "Docker Compose", "AWS EC2", "S3", "CloudFront"],
      },
      {
        category: "Frontend",
        items: ["React", "TypeScript", "Zustand", "Web Worker API"],
      },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
