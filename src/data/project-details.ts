import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 인물 관계 시각화 서비스 개발: Canvas 마이그레이션, 성능 개선 및 인증 구현",
    overview:
      "Stolink는 웹소설 작가들이 방대한 인물 관계와 세계관 설정을 직관적으로 관리할 수 있는 창작 도구입니다. 노드 증가에 따른 SVG 렌더링 성능 저하를 해결하기 위해 Canvas API로 시각화 엔진을 재설계하여 600+ 노드 환경에서 60FPS를 달성했습니다. 또한, 초기 로딩 속도 58% 단축 및 에디터 입력 지연을 제거하여 창작에 온전히 몰입할 수 있는 최적의 사용자 경험을 구축했습니다.",

    keyFocus: {
      headline: "핵심 성과 (Chrome DevTools 측정)",
      points: [
        {
          icon: "zap",
          title: "렌더링 성능 최적화",
          description:
            "SVG 기반 렌더링을 Canvas API로 전환하여 대규모 데이터 상황에서의 인터랙션 성능을 개선했습니다.",
        },
        {
          icon: "layers",
          title: "초기 로딩 58% 감소",
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
          "SEO가 필요 없는 편집 도구 특성상 Next.js의 SSR보다 CSR 방식이 적합하다고 판단했습니다.",
        result:
          "SSR/SSG 미지원으로 초기 로딩 시 빈 화면이 노출되지만, 편집 도구 특성상 SEO가 불필요하여 문제없음. Webpack 대비 HMR 10배 이상 향상.",
      },
      {
        id: "002",
        type: "initial",
        decision: "Zustand + React Query",
        reason:
          "서버 상태와 UI 상태를 분리하고, 낙관적 업데이트나 트리 연산이 필요한 경우에만 Zustand로 동기화했습니다.",
        result:
          "Redux 대비 미들웨어 생태계가 작지만, 단순 UI 상태에는 Redux의 보일러플레이트가 과함. 낙관적 업데이트와 트리 연산 최적화 달성.",
      },
      {
        id: "003",
        type: "initial",
        decision: "Tiptap (ProseMirror)",
        reason:
          "#복선, @캐릭터와 같은 커스텀 문법 기능 구현을 위해 확장성이 높은 Tiptap을 도입했습니다.",
        result:
          "ProseMirror의 학습 곡선이 높지만, Draft.js/Quill로는 불가능한 커스텀 노드(React Component) 확장으로 인터랙티브 요소 구현.",
      },
      {
        id: "004",
        type: "initial",
        decision: "Spring Boot + FastAPI (Polyglot)",
        reason:
          "비즈니스 로직은 Spring Boot로, AI 라이브러리 활용은 Python 기반 FastAPI로 역할을 분리했습니다.",
        result:
          "두 언어/런타임 관리로 인프라 복잡도 증가. Docker Compose로 환경을 통합하고, 각 서비스의 책임을 명확히 분리하여 관리.",
      },
      {
        id: "005",
        type: "initial",
        decision: "PostgreSQL + Neo4j (Hybrid)",
        reason:
          "소설의 정형 데이터와 복잡한 인물 관계(Graph)를 각각 최적의 DB로 처리하기 위해 혼용했습니다.",
        result:
          "이기종 DB 간 동기화 복잡도 증가. PostgreSQL은 소설/챕터 CRUD, Neo4j는 관계 탐색 전용으로 책임을 분리하여 동기화 지점 최소화.",
      },
      {
        id: "006",
        type: "development",
        decision: "Canvas API Migration (vs SVG)",
        reason:
          "DOM 기반 SVG는 노드 30개부터 Reflow로 프레임 저하가 발생하여 Canvas로 전환했습니다.",
        result:
          "DOM 이벤트 위임 불가로 히트맵 감지 직접 구현 필요. react-force-graph-2d의 내장 히트맵 기능을 활용하여 해결, 600+ 노드에서 60FPS 유지.",
      },
      {
        id: "007",
        type: "development",
        decision: "Vendor Chunk Splitting + Prefetch",
        reason:
          "무거운 외부 라이브러리가 초기 로딩을 지연시켜 별도 청크로 분리하고 Lazy Loading을 적용했습니다.",
        result:
          "Lazy Loading으로 해당 페이지 진입 시 로딩 지연 발생. 마우스 호버 시 프리페칭을 시작하여 체감 로딩 시간 최소화. 초기 번들 450KB → 187KB(58% 감소).",
      },
    ],

    sections: [
      {
        id: "canvas-migration",
        title: "도메인 시각화 엔진 최적화",
        subtitle: "Canvas API 마이그레이션",
        challenge:
          "D3.js로 구현된 관계도에서 노드가 30개를 넘어서자, 줌/팬 인터랙션 시 FPS가 10 미만으로 떨어지는 성능 저하가 발생했습니다. 브라우저 렌더링 파이프라인 분석 결과, SVG(DOM) 방식은 매 프레임마다 수백 개의 DOM 요소를 다시 계산(Layout/Reflow)하는 것이 병목임을 확인했습니다.",
        solution:
          "Retained Mode(SVG)에서 Immediate Mode(Canvas)로 렌더링 방식을 전환하여 DOM 부하를 완전히 제거했습니다. react-force-graph-2d 라이브러리를 커스터마이징하여 단일 Canvas 엘리먼트 위에서 모든 노드와 엣지를 픽셀 단위로 직접 제어하도록 아키텍처를 변경했습니다.",
        details: [
          "**Rendering Paradigm Shift**: 수백 개의 SVG DOM을 단 하나의 <canvas> 태그로 통합 (21배 규모에서도 메모리 사용량 오히려 감소)",
          "**Batch Rendering**: 개별적으로 그려지던 노드들을 단일 렌더 루프(Render Loop)에서 일괄 처리하여 드로잉 콜 최소화",
          "**Texture Caching**: 복잡한 캐릭터 이미지를 미리 비트맵으로 캐싱(Offscreen Canvas)하여 프레임당 연산 비용 제거",
        ],
        diagram: {
          type: "mermaid",
          content: `graph LR
  subgraph Before["Before: SVG/DOM 기반"]
    N1["DOM Node 1"] --> L["Layout Calculation"]
    N2["DOM Node 2"] --> L
    N_ALL["DOM Node N..."] --> L
    L --> P["Paint"]
    P --> C["Composite"]
    note1["병목: 노드 = DOM 요소 (Memory Heavy)"]
  end
  subgraph After["After: Canvas 기반"]
    JS["Js Data"] --> D["Draw Command"]
    D --> C_ALL["Single Canvas Layer"]
    C_ALL --> GPU["GPU Rasterization"]
    note2["해결: 픽셀 데이터를 직접 제어 (Low Overhead)"]
  end
  C ~~~ JS`,
          caption: "렌더링 파이프라인 아키텍처 변화",
        },
        impact:
          "최대 500+ 노드에서도 60FPS 유지, INP 94% 개선 (1,048ms → 64ms)",
      },
      {
        id: "bundle-optimization",
        title: "번들 최적화로 초기 로딩 58% 개선",
        subtitle: "Vite Code Splitting + Prefetch",
        challenge:
          "프로덕션 빌드 후 Lighthouse 측정 시, 사용하지 않는 Export 라이브러리(docx 714KB, jspdf 341KB, epub-gen)가 초기 번들에 포함되어 로딩 지연 발생. 초기 JS 크기가 450KB(gzip)에 달했습니다.",
        solution:
          "Vite의 manualChunks 설정으로 라이브러리를 용도별로 분리하고, Lazy Loading의 로딩 지연 문제는 마우스 호버 시 프리페칭으로 해결했습니다.",
        details: [
          "vendor-export (714KB): docx, jspdf, epub-gen → Export 페이지에서만 로드",
          "vendor-graph (61KB): D3, react-force-graph → 관계도 페이지에서만 로드",
          "vendor-editor-extensions (33KB): Tiptap 확장 → 에디터 페이지에서만 로드",
          "Hover Prefetch: 메뉴 호버 시 해당 청크 프리페칭 시작 → 클릭 시 즉시 렌더링",
        ],
        impact: "초기 JS 450KB → 187KB, 페이지 전환 지연 최소화",
      },
      {
        id: "editor-stabilization",
        title: "Tiptap 에디터 인스턴스 안정화",
        subtitle: "useRef 패턴으로 재생성 방지",
        challenge:
          "Tiptap(ProseMirror) 에디터에서 부모 컴포넌트가 리렌더링될 때마다 onUpdate 콜백이 새로 생성되어 에디터 인스턴스가 파괴/재생성되었습니다. 이로 인해 타이핑 도중 커서 위치가 초기화되고, 입력이 씹히는 치명적인 UX 문제가 발생했습니다.",
        solution:
          "useRef를 활용하여 에디터의 의존성과 콜백의 최신성을 분리했습니다. 콜백 함수 대신 ref를 구독하게 하여 리렌더링 사이클을 끊었습니다.",
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
        subtitle: "O(n^2) → O(N)",
        challenge:
          "문서 트리 사이드바에서 노드 클릭/호버마다 Flat Array → Nested Tree 변환 함수(buildTree)가 매번 실행되었습니다. 초기 로직은 재귀 기반의 O(n^2) 연산으로, 문서 수백 개일 때 UI 반응성이 급격히 저하되었습니다.",
        solution:
          "HashMap 기반의 O(n) 트리 조립 로직을 도입하고, useMemo와 참조 동등성을 활용하여 데이터 변경 시에만 재연산하도록 최적화했습니다.",
        details: [
          "Before: 렌더링마다 buildTree(documents) 실행 → 매번 15~20ms 소요",
          "After: useMemo(() => buildTree(documents), [documents]) → 참조 변경 시에만 재연산",
          "불변성(Immutability) 원칙 덕분에 내용이 같으면 참조도 같음이 보장됨",
        ],
        impact: "연산 비용 절감 (O(n^2) → O(N)), UI 반응성 향상",
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
          "작업 크기에 따라 필요한 컨텍스트만 동적으로 주입하는 구조를 설계하고, Supervisor-Worker 모델 기반의 Multi-Agent 워크플로우를 구축하여 개발 과정을 자동화했습니다.",
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
        metric: "450 → 187KB",
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
        metric: "O(n^2) → O(N)",
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
      "Spring Boot + Flask Polyglot 아키텍처로 AI 연산 분리 및 파이프라인 구축",
    overview:
      "AI 기반 육아 기록 플랫폼의 기획부터 배포까지 담당했습니다. AI 이미지 생성이 30초 이상 소요되는 문제를 해결하기 위해 Spring Boot와 Flask를 분리하여 메인 서버 블로킹을 방지했고, 얼굴 특징 추출부터 DALL-E 3 이미지 생성까지 이어지는 AI 파이프라인을 구축했습니다.",

    keyFocus: {
      headline: "핵심 구현",
      points: [
        {
          icon: "layers",
          title: "Polyglot 아키텍처",
          description:
            "AI 연산(Flask)을 분리하여 Spring Boot의 스레드 블로킹 방지. 각 언어의 강점을 적재적소에 활용",
        },
        {
          icon: "zap",
          title: "AI 파이프라인 구축",
          description:
            "얼굴 분석 API → 특징 추출 → 프롬프트 생성 → DALL-E 3 이미지 생성까지 자동화",
        },
      ],
    },

    sections: [
      {
        id: "hybrid-architecture",
        title: "Polyglot 아키텍처 설계",
        subtitle: "Spring Boot + Python Flask",
        challenge:
          "AI 이미지 생성(DALL-E 3)은 30초 이상 소요되는 작업입니다. 이를 메인 서버에서 처리하면 다른 요청이 블로킹됩니다.",
        solution:
          "각 언어의 강점에 맞게 서비스를 분리했습니다. Spring Boot는 비즈니스 로직과 인증을, Python Flask는 AI 연산을 담당합니다.",
        details: [
          "**Spring Boot**: 비즈니스 로직, JWT 인증, JPA 트랜잭션 처리",
          "**Python Flask**: 얼굴 분석 API 호출, OpenAI API 연동",
          "**RestTemplate**: 서비스 간 HTTP 통신으로 느슨한 결합 유지",
        ],
        impact: "AI 연산 분리로 메인 서버 블로킹 방지",
      },
      {
        id: "ai-pipeline",
        title: "AI 파이프라인 구축",
        subtitle: "Face Analysis → DALL-E 3",
        challenge:
          "부모 사진으로 아이 얼굴을 예측하려면 단순 API 호출이 아닌 전처리 과정이 필요했습니다.",
        solution:
          "AILab Tools API로 얼굴 특징점을 추출하고, 이를 자연어 프롬프트로 변환하여 DALL-E 3에 전달하는 파이프라인을 구축했습니다.",
        details: [
          "**Face Analysis**: AILab Tools API로 눈 크기, 코 모양, 얼굴형 등 특징 추출",
          "**Feature Extraction**: 추출된 데이터를 표준화된 형식으로 정제",
          "**Prompt Engineering**: 유전적 영향 가중치를 반영한 DALL-E 최적화 프롬프트 생성",
          "**Image Generation**: DALL-E 3 API 호출 및 결과 저장",
        ],
        impact: "얼굴 특징 기반 프롬프트 자동 생성",
      },
      {
        id: "client-state",
        title: "클라이언트 상태 관리",
        subtitle: "Zustand + localStorage",
        challenge:
          "다수의 useState와 prop drilling으로 인해 상태 흐름을 파악하기 어려웠습니다.",
        solution:
          "Zustand 스토어 기반으로 전역 상태를 일원화하고, localStorage persist로 인증 상태를 유지했습니다.",
        details: [
          "**useAuthStore**: JWT 토큰 관리 및 localStorage 영속화",
          "**useDiaryStore**: 페이지네이션 상태 관리",
          "**Axios Interceptor**: 401 응답 시 자동 로그아웃 처리",
        ],
        impact: "Prop Drilling 제거, 페이지 새로고침에도 인증 상태 유지",
      },
    ],

    achievements: [
      {
        metric: "Polyglot",
        label: "서비스 분리",
        description:
          "Spring Boot(비즈니스) + Flask(AI) 분리로 30초+ AI 연산의 블로킹 방지",
      },
      {
        metric: "4단계",
        label: "AI 파이프라인",
        description: "얼굴 분석 → 특징 추출 → 프롬프트 생성 → 이미지 생성 자동화",
      },
      {
        metric: "Zustand",
        label: "상태 관리",
        description:
          "localStorage persist로 인증 상태 유지, Axios Interceptor로 토큰 자동 처리",
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
      { category: "AI/ML", items: ["OpenAI API (DALL-E 3, GPT-4)", "AILab Tools API"] },
      {
        category: "Infra",
        items: ["Docker", "Docker Compose"],
      },
    ],
  },

};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
