import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline: "Canvas 마이그레이션을 통한 렌더링 최적화 및 End-to-End 성능 개선",
    overview:
      "사용자 경험 향상을 위해 브라우저 렌더링 병목 해결부터 백엔드 쿼리 최적화까지, 서비스 전반의 기술적 난제를 End-to-End로 해결했습니다.",

    keyFocus: {
      headline: "핵심 성과 (Chrome DevTools 측정)",
      points: [
        {
          icon: "zap",
          title: "렌더링 성능 최적화",
          description:
            "SVG 기반 렌더링을 Canvas API로 전환하여 대규모 데이터 상황에서의 인터랙션 성능을 획기적으로 개선했습니다.",
        },
        {
          icon: "layers",
          title: "초기 로딩 60% 감소",
          description:
            "Vite manualChunks로 Export/Graph 라이브러리를 Lazy Load 처리. 초기 JS 450KB → 187KB(gzip) 달성했습니다.",
        },
      ],
    },
    decisions: [
      {
        id: "001",
        type: "initial",
        decision: "React 19 + Vite (SPA)",
        reason:
          "SEO가 필요 없는 편집 도구 특성상 Next.js의 SSR 오버헤드보다는 SPA가 적합하다고 판단했습니다.",
        tradeoff:
          "빌드 속도 10배 개선을 얻었으나, 초기 로드 최적화(청크 분할) 과제가 추가되었습니다.",
      },
      {
        id: "002",
        type: "initial",
        decision: "Tailwind + shadcn/ui",
        reason:
          "외부 패키지에 의존하기보다 코드를 직접 소유하고 수정할 수 있는 shadcn의 방식을 택했습니다.",
        tradeoff:
          "유틸리티 클래스로 인한 코드 복잡도는 높아졌지만, Paper 스타일의 미세 조정이 가능해졌습니다.",
      },
      {
        id: "003",
        type: "initial",
        decision: "Zustand + React Query",
        reason:
          "서버 데이터(캐싱 필요)와 UI 상태(경량 필요)를 분할하여 Redux 대비 보일러플레이트를 80% 줄였습니다.",
        tradeoff: "두 가지 도구를 모두 학습해야 하는 팀 비용이 발생했습니다.",
      },
      {
        id: "004",
        type: "initial",
        decision: "Tiptap (ProseMirror)",
        reason:
          "단순 텍스트를 넘어 #복선, @캐릭터 같은 커스텀 문법을 구현하기 위해 ProseMirror 기반 확장성이 필수였습니다.",
        tradeoff:
          "Draft.js나 Quill보다 학습 곡선이 매우 높지만, 자유로운 토큰 렌더링이 가능해졌습니다.",
      },
      {
        id: "005",
        type: "initial",
        decision: "Spring Boot + FastAPI (Polyglot)",
        reason:
          "안정적인 비즈니스 로직(Spring)과 최신 AI 생태계 활용(FastAPI)을 위해 역할을 분리했습니다.",
        tradeoff:
          "두 가지 언어 스택을 유지보수해야 하는 인프라 복잡도가 증가했습니다.",
      },
      {
        id: "006",
        type: "initial",
        decision: "PostgreSQL + Neo4j (Hybrid)",
        reason:
          "정형 데이터의 무결성과 복잡한 인물 관계(Graph) 탐색 성능을 동시에 확보하고자 했습니다.",
        tradeoff: "서로 다른 두 DB 간의 데이터 동기화 전략이 중요해졌습니다.",
      },
      {
        id: "007",
        type: "development",
        decision: "RabbitMQ 기반 비동기 메시징",
        reason:
          "무거운 AI 분석 작업을 HTTP 동기 요청으로 처리할 때 발생하는 타임아웃과 스레드 고갈을 해결했습니다.",
        tradeoff:
          "메시지 브로커 운영 비용과 최종 일관성(Eventual Consistency) 처리가 필요합니다.",
      },
      {
        id: "008",
        type: "development",
        decision: "D3.js Force Simulation",
        reason:
          "수동으로 노드를 배치하는 React Flow와 달리, 물리 시뮬레이션으로 관계를 유기적으로 배치했습니다.",
        tradeoff:
          "번들 크기를 59% 절감했으나, 5개의 커스텀 훅으로 시뮬레이션을 정밀 제어해야 하는 복잡도가 생겼습니다.",
      },
      {
        id: "009",
        type: "development",
        decision: "LangGraph AI Pipeline",
        reason:
          "글쓰기 과정에서 설정을 자동 추출하여 작가의 데이터 관리 부담을 제거하고 핵심 가치를 구현했습니다.",
        tradeoff: "",
      },
      {
        id: "010",
        type: "development",
        decision: "13개 Vendor 청크 분할",
        reason:
          "90%의 사용자가 쓰지 않는 1.25MB의 Export 라이브러리가 초기 로딩을 방해하는 문제를 발견했습니다.",
        tradeoff:
          "빌드 시간은 9% 늘어났지만 초기 번들 로딩 속도를 1.5초(Fast 3G) 단축했습니다.",
      },
    ],

    sections: [
      {
        id: "canvas-migration",
        title: "도메인 시각화 엔진 최적화",
        subtitle: "Canvas API 마이그레이션",
        challenge:
          "D3.js 기반 캐릭터 관계도에서 노드가 30개를 넘어서자 줌/팬 조작 시 FPS가 10 미만으로 하락했습니다. Chrome DevTools 프로파일링 결과, 매 프레임마다 수백 개 DOM 요소의 Style Recalculation에 935ms가 소요되고 있었습니다.",
        solution:
          "SVG(DOM) 기반 렌더링을 Canvas API(react-force-graph-2d)로 전면 전환했습니다. 단일 Canvas 레이어에서 일괄 드로잉하여 브라우저의 스타일 재계산 부하를 완전히 제거했습니다.",
        details: [
          "Single Layer Rendering: 개별 DOM 노드 대신 Canvas 컨텍스트에서 Batch Drawing",
          "Image Caching (useImageCache): 캐릭터 이미지를 텍스처로 메모리에 캐싱하여 드로잉 성능 최적화",
          "Color-based Hit Detection: Canvas에서 클릭 이벤트 감지를 위한 O(1) 히트맵 구현 - 각 노드를 고유 색상으로 칠한 히든 캔버스에서 픽셀 색상으로 노드 ID 역추적",
        ],
        diagram: {
          type: "mermaid",
          content: `graph TB
  subgraph Before[Before: SVG/DOM]
    A[Node 1] --> S1[Style Recalc]
    B[Node 2] --> S1
    C[Node N] --> S1
    S1 --> R1[Reflow 935ms/frame]
  end
  subgraph After[After: Canvas]
    D[All Nodes] --> C1[Single Canvas]
    C1 --> R2[GPU Rasterization ~0ms]
  end`,
          caption: "렌더링 파이프라인 비교",
        },
        impact: "INP 1,048ms → 64ms",
      },
      {
        id: "bundle-optimization",
        title: "번들 최적화로 초기 로딩 60% 개선",
        subtitle: "Vite Code Splitting",
        challenge:
          "프로덕션 빌드 후 Lighthouse 측정 시, 사용하지 않는 Export 라이브러리(docx 714KB, jspdf 341KB, epub-gen)가 초기 번들에 포함되어 로딩 지연 발생. 초기 JS 크기가 450KB(gzip)에 달했습니다.",
        solution:
          "Vite의 manualChunks 설정으로 라이브러리를 용도별로 분리하고 Lazy Loading을 적용했습니다.",
        details: [
          "vendor-export (714KB): docx, jspdf, epub-gen → Export 페이지에서만 로드",
          "vendor-graph (61KB): D3, react-force-graph → 관계도 페이지에서만 로드",
          "vendor-editor-extensions (33KB): Tiptap 확장 → 에디터 페이지에서만 로드",
          "캐시 효율성: 세분화된 청크로 코드 수정 시 변경된 청크만 재다운로드 (40% → 85%)",
        ],
        impact: "초기 JS 450KB → 187KB",
      },
      {
        id: "editor-stabilization",
        title: "Tiptap 에디터 인스턴스 안정화",
        subtitle: "useRef 패턴으로 재생성 방지",
        challenge:
          "Tiptap(ProseMirror) 에디터에서 부모 컴포넌트가 리렌더링될 때마다 onUpdate 콜백이 새로 생성되어 에디터 인스턴스가 파괴/재생성되었습니다. 이로 인해 타이핑 도중 커서 위치가 초기화되고, 입력이 씹히는 치명적인 UX 문제가 발생했습니다.",
        solution:
          "Stable Callback Ref 패턴을 적용하여 에디터의 의존성(Dependencies)과 콜백의 최신성(Freshness)을 분리했습니다. 함수 자체가 아닌 함수의 참조(ref)를 구독하게 하여 리렌더링 사이클을 끊었습니다.",
        details: [
          "Before: useEditor({ onUpdate }, [onUpdate]) → 콜백 변경 시 에디터 전체 재생성",
          "After: onUpdateRef = useRef(callback) → ref.current만 갱신, 에디터는 최초 1회만 생성",
          "useEffect로 ref.current를 동기화하여 항상 최신 로직에 접근 가능",
        ],
        impact: "인스턴스 재생성 0회, 커서 튐 완전 제거",
      },
      {
        id: "tree-memoization",
        title: "트리 조립 로직 및 메모이제이션 최적화",
        subtitle: "O(n^2) → O(n) → O(1)",
        challenge:
          "문서 트리 사이드바에서 노드 클릭/호버마다 Flat Array → Nested Tree 변환 함수(buildTree)가 매번 실행되었습니다. 초기 로직은 재귀 기반의 O(n^2) 연산으로, 문서 수백 개일 때 UI 반응성이 급격히 저하되었습니다.",
        solution:
          "HashMap 기반의 O(n) 트리 조립 로직을 도입하고, useMemo와 참조 동등성을 활용하여 데이터 변경 시에만 재연산하도록 최적화했습니다.",
        details: [
          "Before: 렌더링마다 buildTree(documents) 실행 → 매번 15~20ms 소요",
          "After: useMemo(() => buildTree(documents), [documents]) → 참조 변경 시에만 재연산",
          "불변성(Immutability) 원칙 덕분에 내용이 같으면 참조도 같음이 보장됨",
        ],
        impact: "연산 비용 제거 (O(n^2) → O(1)), 반응성 극대화",
        codeExample: {
          language: "typescript",
          caption: "HashMap 기반 O(n) 트리 조립 (Frontend)",
          code: `// O(n^2) 재귀 대신 HashMap을 사용하여 O(n)으로 변환
const buildTree = (docs: Document[]) => {
  const map = new Map<string, TreeItem>();
  const roots: TreeItem[] = [];

  // 1. 모든 노드를 Map에 등록 (O(n))
  docs.forEach(doc => map.set(doc.id, { ...doc, children: [] }));

  // 2. Map 참조를 통해 부모-자식 관계 연결 (O(n))
  docs.forEach(doc => {
    const item = map.get(doc.id)!;
    if (!doc.parentId) roots.push(item);
    else map.get(doc.parentId)?.children.push(item);
  });
  return roots;
};`,
        },
      },
      {
        id: "backend-optimization",
        title: "API 응답 성능 최적화",
        subtitle: "N+1 쿼리 해결 및 트리 구조 개선",
        challenge:
          "계층형 문서 구조를 조회할 때, 각 문서의 부모를 찾기 위해 Lazy Loading이 발생하여 문서 100개 조회 시 101번의 쿼리가 실행되는 N+1 문제가 발생했습니다. 이로 인해 API 응답 속도가 450ms까지 저하되었습니다.",
        solution:
          "JPA의 JOIN FETCH를 사용하여 연관된 부모 엔티티를 단일 쿼리로 조회하고, DB 부하를 줄이기 위해 애플리케이션 메모리(HashMap)에서 O(N)으로 트리를 조립하는 방식으로 변경했습니다.",
        details: [
          "**Fetch Join**: `LEFT JOIN FETCH d.parent`로 N+1 문제 원천 차단 (쿼리 1회로 감소)",
          "**In-Memory Tree**: `HashMap<UUID, DTO>`를 활용하여 O(N^2) 중첩 루프를 제거하고 O(N)으로 최적화",
          "**Role Separation**: DB는 단순 조회, 복잡한 연산은 WAS가 담당하여 스케일 아웃이 용이한 구조 확립",
        ],
        impact: "쿼리 99% 감소, 응답 속도 18배(450ms → 25ms) 개선",
        codeExample: {
          language: "java",
          caption: "JPA Fetch Join & In-Memory Tree Assembly",
          code: `// 1. Repository: Fetch Join으로 N+1 해결 (Query 101회 -> 1회)
@Query("SELECT d FROM Document d LEFT JOIN FETCH d.parent WHERE d.project = :p")
List<Document> findAllWithParent(@Param("p") Project project);

// 2. Service: In-Memory Tree Assembly (O(N))
Map<UUID, DocumentDto> dtoMap = docs.stream()
    .collect(Collectors.toMap(Document::getId, DocumentDto::from));

docs.forEach(doc -> { // HashMap 참조로 부모-자식 연결 비용 최소화
    if (doc.getParent() == null) roots.add(dtoMap.get(doc.getId()));
    else dtoMap.get(doc.getParent().getId()).children.add(dtoMap.get(doc.getId()));
});`,
        },
      },
      {
        id: "ai-workflow",
        title: "AI 에이전트 워크플로우 자동화",
        subtitle: "Multi-Agent 협업 및 운영 인프라 구축",
        challenge:
          "5인 팀 개발 중 Git 숙련도 격차로 인한 브랜치 충돌, 이슈 트래킹 누락, 구두 합의된 컨벤션 미준수 등 협업 비효율이 발생했습니다. 특히 대규모 리팩토링 시 AI의 컨텍스트 한계로 인한 오류 제어가 어려웠습니다.",
        solution:
          "코드베이스를 AI 친화적으로 구조화하는 'Context-as-a-Service' 전략을 도입하고, Supervisor-Worker 모델 기반의 Multi-Agent 워크플로우를 구축하여 개발 전 과정을 자동화했습니다.",
        details: [
          "**작업 분류 및 할당 (Supervisor)**: 작업의 크기를 분석해 필요한 정보만 골라주고, 가장 적합한 에이전트에게 일을 맡깁니다.",
          "**역할별 전문가 협업 (Specialized Workers)**: 구조 설계, 감성적 디자인, 미세 코드 수정 등 각자 맡은 분야만 전문적으로 처리합니다.",
          "**자동 품질 보증 (Auditor)**: 성능이나 접근성 등 엄격한 기준을 통과하지 못한 코드는 배포되지 않도록 사전에 차단합니다.",
          "**문서 최신화 (Librarian)**: 코드가 바뀌면 기술 문서도 자동으로 업데이트하여, 언제나 믿을 수 있는 최신 상태를 유지합니다.",
        ],
        impact:
          "개인 생산성 도구로 시작하여 팀 전체 및 타 프로젝트 팀으로 도입 확산",
      },
    ],

    achievements: [
      {
        metric: "FPS 개선",
        label: "렌더링 성능",
        description:
          "Canvas API 전환을 통한 대규모 노드 환경에서의 인터랙션 지연 제거",
      },
      {
        metric: "450 → 190KB",
        label: "초기 번들 크기",
        description:
          "Vite manualChunks로 Export/Graph 라이브러리 Lazy Loading 적용 (gzip 기준)",
      },
      {
        metric: "인스턴스 유지",
        label: "에디터 안정화",
        description:
          "useRef 패턴으로 부모 리렌더링에도 Tiptap 인스턴스 유지, 커서 튐 현상 해결",
      },
      {
        metric: "O(n^2) → O(1)",
        label: "트리 최적화",
        description:
          "HashMap 기반 O(n) 조립 + useMemo로 데이터 변경 시에만 재구성",
      },
    ],

    techStack: [
      {
        category: "Backend",
        items: ["Spring Boot 3.4", "FastAPI", "RabbitMQ"],
      },
      {
        category: "Frontend",
        items: [
          "React 19",
          "TypeScript 5.9",
          "Vite",
          "Zustand",
          "TanStack Query",
        ],
      },
      {
        category: "Visualization",
        items: ["Canvas API", "D3.js", "react-force-graph-2d"],
      },
      {
        category: "Editor",
        items: ["Tiptap", "ProseMirror"],
      },
      {
        category: "AI / Database",
        items: ["LangGraph", "PostgreSQL", "Neo4j"],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "Spring Boot + Python Flask 마이크로서비스, Docker Compose로 6개 컨테이너 구성",
    overview:
      "AI 기반 육아 기록 플랫폼의 기획부터 배포까지 담당했습니다. 프론트엔드에서는 사용자 UX를 고려한 상태 관리를, 백엔드에서는 Spring Boot와 Flask를 활용한 AI 파이프라인 아키텍처를 설계하여 대규모 연산 부하를 효율적으로 분산했습니다.",

    keyFocus: {
      headline: "핵심 구현",
      points: [
        {
          icon: "layers",
          title: "마이크로서비스 아키텍처",
          description:
            "Spring Boot(비즈니스 로직) + Python Flask(AI 연산) + React 프론트엔드 3개 서비스 구성",
        },
        {
          icon: "zap",
          title: "Docker Compose 오케스트레이션",
          description:
            "FE, BE, AI, DB, Prometheus, Grafana 6개 컨테이너를 단일 명령으로 구동",
        },
      ],
    },

    sections: [
      {
        id: "client-state",
        title: "클라이언트 상태 관리 아키텍처",
        subtitle: "Zustand + Custom Hooks",
        challenge:
          "다수의 useState와 prop drilling으로 인해 상태 흐름을 파악하기 어려웠습니다. 같은 데이터를 여러 컴포넌트에서 중복 관리하고 있었습니다.",
        solution:
          "Zustand 스토어 기반으로 전역 상태를 일원화하고, Custom Hooks로 비즈니스 로직을 View에서 분리했습니다.",
        details: [
          "**Zustand** 스토어로 전역 상태 중앙 관리",
          "**useCharacter.ts** 등 도메인별 `Custom Hooks`로 로직 분리",
          "**Single Source of Truth** 원칙 적용",
        ],
        impact: "Prop Drilling 제거",
      },
      {
        id: "hybrid-architecture",
        title: "Hybrid AI Architecture",
        subtitle: "Spring Boot + Python Flask",
        challenge:
          "AI 이미지 생성(DALL-E 3)은 30초 이상 소요되는 작업입니다. 이를 메인 서버에서 처리하면 다른 요청이 블로킹됩니다.",
        solution:
          "적재적소 원칙으로 서비스를 분리했습니다. Spring Boot는 비즈니스 로직과 인증, Python Flask는 AI/ML 라이브러리 활용에 집중합니다.",
        details: [
          "**Spring Boot**: 비즈니스 로직, 트랜잭션, 보안/인증",
          "**Python Flask**: `face-cli`, `OpenAI API` 등 AI 연산",
          "**RestTemplate**: 서비스 간 HTTP 통신",
        ],
        impact: "AI 연산 분리로 메인 서버 블로킹 방지",
      },
      {
        id: "ai-pipeline",
        title: "AI Pipeline 구축",
        subtitle: "Face Analysis + DALL-E 3",
        challenge:
          "부모 사진으로 아이 얼굴을 예측하려면 단순 API 호출이 아닌 전처리 과정이 필요했습니다.",
        solution:
          "huggingface의 `face-analyzer`로 얼굴 특징점을 추출하고, 이를 자연어 프롬프트로 변환하여 DALL-E 3에 전달하는 파이프라인을 구축했습니다.",
        details: [
          "**Input**: 부모 사진 업로드",
          "**Preprocessing**: `face-analyzer`로 얼굴 특징점 추출",
          "**Prompt Engineering**: 필요한 특징 데이터 정제 → 자연어 프롬프트 변환",
          "**Generation**: `DALL-E 3` API 호출",
        ],
        impact: "얼굴 특징 기반 프롬프트 자동 생성",
      },
    ],

    achievements: [
      {
        metric: "3개 서비스",
        label: "마이크로서비스 구성",
        description:
          "Spring Boot + Python Flask + React 독립적인 서비스로 분리",
      },
      {
        metric: "6개 컨테이너",
        label: "Docker Compose",
        description: "FE, BE, AI, DB, Prometheus, Grafana 전체 인프라 구성",
      },
      {
        metric: "Zustand",
        label: "상태 관리",
        description:
          "Custom Hooks 패턴으로 전역 상태 관리 및 비즈니스 로직 분리",
      },
    ],

    techStack: [
      {
        category: "Backend",
        items: ["Java 17", "Spring Boot 3.4", "Python 3.9", "Flask"],
      },
      {
        category: "Client-side",
        items: ["React 18", "TypeScript", "Zustand", "TailwindCSS"],
      },
      { category: "Database", items: ["MariaDB"] },
      { category: "AI/ML", items: ["OpenAI API (DALL-E 3)", "face-cli"] },
      {
        category: "Infra",
        items: ["Docker", "Docker Compose", "Prometheus", "Grafana"],
      },
    ],
  },

  garden: {
    id: "garden",
    tagline:
      "마크다운 파싱 + GitHub GraphQL API로 학습 데이터 자동 수집 및 시각화",
    overview:
      "옵시디언 마크다운 파일과 GitHub 기여 데이터를 자동으로 수집·분석하여 학습 현황을 시각화하는 개인 대시보드입니다. gray-matter로 frontmatter를 파싱하고, GitHub GraphQL API로 365일 기여 데이터를 조회하여 통합 히트맵을 생성합니다.",

    keyFocus: {
      headline: "핵심 기술 구현",
      points: [
        {
          icon: "database",
          title: "데이터 파이프라인 자동화",
          description:
            "glob으로 마크다운 파일 탐색 → gray-matter로 파싱 → [[wikilink]] 정규식 추출 → GitHub API 병합까지 완전 자동화된 데이터 수집 파이프라인을 구축했습니다.",
        },
        {
          icon: "zap",
          title: "Next.js SSR + 동적 import",
          description:
            "react-force-graph-3d(WebGL)가 서버에서 렌더링 불가한 문제를 dynamic import + ssr: false로 해결하여 3D 지식 그래프를 구현했습니다.",
        },
      ],
    },

    sections: [
      {
        id: "markdown-pipeline",
        title: "마크다운 파싱 파이프라인",
        subtitle: "gray-matter + glob",
        challenge:
          "옵시디언의 수백 개 마크다운 파일에서 frontmatter(태그, 날짜)와 [[wikilink]] 연결 관계를 추출하여 그래프 데이터로 변환해야 했습니다.",
        solution:
          "glob으로 파일 시스템을 탐색하고, gray-matter로 YAML frontmatter를 파싱한 뒤, 정규식으로 wikilink를 추출하는 파이프라인을 구축했습니다.",
        details: [
          "glob('**/*.md'): .obsidian 폴더 제외하고 모든 마크다운 파일 탐색",
          "gray-matter: YAML frontmatter에서 tags, date, title 추출",
          "정규식 /\\[\\[(.*?)\\]\\]/g: wikilink 파싱 후 노드 간 링크 생성",
          "fs.statSync: frontmatter에 날짜 없으면 파일 생성일(birthtime) 폴백",
        ],
        impact: "수백 개 파일 자동 처리",
      },
      {
        id: "github-graphql",
        title: "GitHub GraphQL API 연동",
        subtitle: "Octokit + 데이터 병합",
        challenge:
          "로컬 마크다운 데이터만으로는 실제 개발 활동을 반영할 수 없어, GitHub 기여 데이터를 통합해야 했습니다. REST API로는 contribution calendar 조회가 불가능했습니다.",
        solution:
          "Octokit의 GraphQL 클라이언트로 contributionsCollection을 조회하고, 로컬 데이터와 병합하여 통합 히트맵을 생성했습니다.",
        details: [
          "GraphQL query: user → contributionsCollection → contributionCalendar → weeks → contributionDays",
          "365일 기여 데이터를 한 번의 API 호출로 조회 (REST 대비 효율적)",
          "heatmapMap 객체로 로컬 + GitHub 데이터 병합 (동일 날짜는 합산)",
          "스트릭 계산: 날짜 역순 정렬 후 연속 기여일 카운트",
        ],
        impact: "365일 기여 데이터 통합",
      },
      {
        id: "competency-algorithm",
        title: "역량 평가 알고리즘 설계",
        subtitle: "Goldilocks Scoring",
        challenge:
          "단순 키워드 카운트로는 학습 깊이를 반영할 수 없고, 100점에 쉽게 도달하면 동기 부여가 되지 않는 문제가 있었습니다.",
        solution:
          "Diminishing Returns 로직을 적용하여 85점 이후 상승폭을 1/5로 제한하고, 문서 길이와 코드 블록 유무에 따른 가중치를 부여했습니다.",
        details: [
          "Base Score(35점): 활동이 있으면 최소 35%부터 시작",
          "Coverage Score: 카테고리별 키워드 커버리지 (최대 35점)",
          "Depth Score: 문서 길이 2000자 이상(+0.8), 코드 블록 포함(+0.7) 가중치",
          "Diminishing Returns: 85점 초과 시 (rawScore - 85) / 5로 상승폭 제한",
        ],
        impact: "85점 이후 성장 난이도 5배",
      },
      {
        id: "3d-graph-ssr",
        title: "3D 지식 그래프 SSR 해결",
        subtitle: "Next.js dynamic import",
        challenge:
          "react-force-graph-3d는 WebGL/Three.js 기반으로 window 객체가 필요하여 Next.js 서버 사이드 렌더링 시 'window is not defined' 에러가 발생했습니다.",
        solution:
          "Next.js의 dynamic import와 ssr: false 옵션으로 클라이언트에서만 컴포넌트를 로드하고, 로딩 중에는 fallback UI를 표시했습니다.",
        details: [
          "dynamic(() => import('react-force-graph-3d'), { ssr: false })",
          "loading 콜백으로 'BOOTING NEURAL LINK...' 로딩 UI 제공",
          "useMemo로 날짜별 필터링 데이터 메모이제이션",
          "setInterval로 시간순 노드 등장 애니메이션 구현",
        ],
        impact: "SSR 에러 해결 + 3D 시각화",
      },
    ],

    achievements: [
      {
        metric: "365일",
        label: "GitHub 기여 데이터",
        description:
          "GraphQL API 단일 호출로 1년치 contribution calendar 조회 및 통합",
      },
      {
        metric: "5x",
        label: "85점 이후 난이도",
        description:
          "Diminishing Returns 로직으로 완벽한 척 방지, 지속적 성장 동기 부여",
      },
      {
        metric: "0",
        label: "수동 입력",
        description: "마크다운 파싱 + GitHub API로 학습 데이터 완전 자동 수집",
      },
      {
        metric: "SSR",
        label: "에러 해결",
        description:
          "dynamic import로 WebGL 기반 3D 그래프의 서버 렌더링 문제 해결",
      },
    ],

    techStack: [
      {
        category: "Framework",
        items: ["Next.js 15", "React 19", "TypeScript"],
      },
      { category: "Data", items: ["gray-matter", "glob", "Octokit (GraphQL)"] },
      {
        category: "Visualization",
        items: ["Recharts", "react-force-graph-3d", "react-calendar-heatmap"],
      },
      { category: "Styling", items: ["TailwindCSS", "Framer Motion"] },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
