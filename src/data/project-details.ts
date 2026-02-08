import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 창작/열람 플랫폼: Canvas 렌더링 최적화 및 모바일 뷰어 UX 개선",
    overview:
      "StoLink는 작가를 위한 데스크톱 저작 도구이며, 사이드 프로젝트로 독자를 위한 모바일 뷰어 StoRead를 함께 개발했습니다. 인물 관계도의 렌더링 성능 문제(420ms 지연)를 Canvas 마이그레이션으로 해결하고, 초기 로딩 속도를 58% 단축했습니다. 또한 모바일 환경에 최적화된 뷰어와 결제 시스템, AI 기반 DX 자동화를 도입하여 서비스의 기술적 완성도를 높였습니다.",

    keyFocus: {
      headline: "핵심 성과 (Chrome DevTools 측정)",
      points: [
        {
          icon: "zap",
          title: "렌더링 성능 최적화",
          description:
            "SVG 기반 렌더링을 Canvas API로 전환하여 650+ 노드 환경에서 레이아웃(Reflow) 비용을 완벽히 제거했습니다.",
        },
        {
          icon: "layers",
          title: "초기 번들 58% 감량",
          description:
            "Vite manualChunks로 Vendor 청크를 13개로 세분화하여 초기 JS 번들 크기를 450KB → 187KB(gzip)로 최적화했습니다.",
        },
        {
          icon: "smartphone",
          title: "모바일 퍼스트 UX",
          description:
            "모바일 뷰어(StoRead)에서 스크롤/페이지 모드 전환과 터치 제스처를 지원하여 이동 중 읽기 경험을 개선했습니다.",
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
        type: "development",
        decision: "Canvas API Migration",
        reason:
          "DOM 기반 SVG는 노드 30개부터 Reflow로 프레임 저하(10fps 미만)가 발생하여 Canvas로 전환했습니다.",
        result:
          "명령형 물리 엔진과 선언적 React UI 간의 패러다임 충돌을 Simulation Sandbox(structuredClone + Ref) 아키텍처로 해결. 프레임 드랍의 원인인 Reflow를 제거(0ms)하여 INP 성능을 85% 개선.",
      },
      {
        id: "003",
        type: "development",
        decision: "Toss Payment Integration",
        reason:
          "안전한 결제 처리를 위해 클라이언트 조작이 불가능한 3단계 검증 프로세스가 필요했습니다.",
        result:
          "Toss MCP를 활용하여 결제 위젯을 연동하고, server-side orderId 발급으로 위변조를 원천 차단했습니다.",
      },
      {
        id: "004",
        type: "development",
        decision: "Vendor Chunk Splitting",
        reason:
          "무거운 외부 라이브러리(Three.js, D3 등)가 초기 로딩을 지연시켜 별도 청크로 분리했습니다.",
        result:
          "Vendor 청크를 13개로 세분화하여 캐시 효율성을 극대화하고, 초기 로딩 시간을 58% 단축했습니다.",
      },
    ],

    sections: [
      {
        id: "canvas-migration",
        title: "도메인 시각화 엔진 최적화",
        subtitle: "Canvas API 마이그레이션",
        challenge:
          "D3.js로 구현된 관계도에서 노드가 30개를 넘어서자, 줌/팬 인터랙션 시 FPS가 10 미만으로 떨어지는 성능 저하가 발생했습니다. 프로파일링 결과, 스타일 재계산(Style Recalculation)에만 프레임당 935ms가 소요되는 것이 원인이었습니다.",
        solution:
          "Retained Mode(SVG)에서 Immediate Mode(Canvas)로 렌더링 방식을 전환하여 DOM 부하를 완전히 제거했습니다. 단일 Canvas 엘리먼트 위에서 모든 노드와 엣지를 픽셀 단위로 직접 제어하도록 아키텍처를 변경했습니다.",
        details: [
          "**Simulation Sandbox**: structuredClone과 useRef를 활용해 물리 엔진의 가변성을 React의 불변성 제약으로부터 격리하여 런타임 안정성 확보",
          "**Runtime Optimization**: 도구가 제공하는 추상화 레이어를 넘어 내부 D3 Force 인스턴스에 직접 커스텀 물리 법칙을 주입하여 기획 요건 달성",
          "**Zero Reflow**: DOM 요소를 완전히 제거하고 Canvas 픽셀 단위로 직접 제어하여 브라우저의 레이아웃 병목을 원천적으로 차단",
        ],
        diagram: {
          type: "mermaid",
          content: `graph LR
  subgraph Before["Before: SVG/DOM 기반"]
    N1["DOM Node 1"] --> L["Layout Calculation"]
    N2["DOM Node 2"] --> L
    L --> P["Paint"]
    note1["병목: Reflow (935ms)"]
  end
  subgraph After["After: Canvas 기반"]
    JS["Js Data"] --> D["Draw Command"]
    D --> C_ALL["Single Canvas Layer"]
    C_ALL --> GPU["GPU Rasterization"]
    note2["해결: Zero Reflow (0ms)"]
  end`,
          caption: "렌더링 파이프라인 아키텍처 변화",
        },
        impact: "650+ 노드 환경에서 60FPS 유지, INP 85% 개선 (420ms → 64ms)",
      },
      {
        id: "bundle-optimization",
        title: "번들 최적화로 초기 로딩 58% 개선",
        subtitle: "Vite Manual Chunks + Prefetch",
        challenge:
          "프로덕션 빌드 후 초기 JS 번들 크기가 450KB(gzip)에 달해 로딩 속도가 느렸습니다. 분석 결과, 특정 페이지에서만 쓰이는 무거운 라이브러리(Three.js, D3)가 메인 번들에 포함되어 있었습니다.",
        solution:
          "Vite의 manualChunks 설정으로 Vendor 라이브러리를 용도별로 13개 청크로 세분화하고, 라우트 진입 전 Prefetching을 적용했습니다.",
        details: [
          "**Chunk Splitting**: vendor-graph(D3), vendor-editor(Tiptap) 등 기능별 분리",
          "**Cache Optimization**: 변경 빈도가 낮은 라이브러리를 분리하여 브라우저 캐시 적중률 향상",
          "**Prefetching**: 마우스 호버 시 해당 청크를 미리 로드하여 페이지 전환 지연 최소화",
        ],
        impact: "초기 JS 450KB → 187KB (58% 절감)",
      },
      {
        id: "storead-mobile",
        title: "모바일 퍼스트 뷰어 (StoRead)",
        subtitle: "모바일 독서 경험 최적화",
        challenge:
          "데스크톱 중심의 기존 뷰어는 모바일 화면에서 가독성이 떨어지고 조작이 불편했습니다. 이동 중이나 한 손으로 조작하는 모바일 사용자 맥락을 고려해야 했습니다.",
        solution:
          "모바일 뷰포트에 최적화된 반응형 뷰어를 개발하고, 터치 제스처 기반의 페이지 넘김과 스크롤/페이지 모드 전환 기능을 구현했습니다.",
        details: [
          "**Responsive Layout**: 폰트 크기, 줄 간격, 여백을 모바일 가독성에 맞춰 동적 조절",
          "**Touch Interaction**: Swipe로 페이지 넘김, Tap으로 메뉴 토글 구현",
          "**Mode Switching**: 사용자 선호에 따라 스크루/페이지 뷰 모드 즉시 전환 지원",
        ],
        impact: "모바일 사용자 리텐션 및 완독률 증가 기여",
      },
      {
        id: "storead-progress",
        title: "이어읽기 경험 개선",
        subtitle: "Debounced Scroll Sync",
        challenge:
          "스크롤 할 때마다 읽은 위치를 서버에 저장하면 과도한 API 호출이 발생하고, 반대로 저장을 안 하면 사용자가 읽던 위치를 잃어버리는 문제가 있었습니다.",
        solution:
          "스크롤 이벤트에 Debounce를 적용하고, 의미 있는 이동(100px 이상)이 감지될 때만 1초 딜레이 후 위치를 저장하도록 최적화했습니다.",
        details: [
          "**Optimization**: 불필요한 API 호출 90% 이상 감소",
          "**UX**: 네트워크 요청 실패 시에도 로컬 스토리지에 백업하여 데이터 유실 방지",
        ],
        impact: "서버 부하 감소 및 끊김 없는 이어읽기 경험 제공",
      },
      {
        id: "toss-payments",
        title: "결제 시스템 연동 (TossPayments)",
        subtitle: "보안이 강화된 결제 플로우",
        challenge:
          "클라이언트 사이드에서 결제 금액을 변조할 수 있는 보안 취약점이 우려되었습니다. 또한 결제 중 네트워크가 끊기는 상황에 대한 예외 처리가 필요했습니다.",
        solution:
          "Toss Payment Widget을 연동하고, 결제 요청(prepare) → 인증(SDK) → 승인(confirm)의 3단계 검증 프로세스를 구축했습니다.",
        details: [
          "**Server-side OrderId**: 주문 ID와 금액을 서버에서 발급/검증하여 위변조 원천 차단",
          "**Idempotency**: ReferenceId(주문번호)를 통해 중복 결제 요청 방지",
          "**Optimistic UI**: TanStack Query 캐시 무효화로 결제 직후 UI에 즉시 반영",
        ],
        impact: "결제 데이터 무결성 100% 보장 및 테스트 결제 환경 구축",
      },
      {
        id: "dx-automation",
        title: "팀 생산성을 위한 DX 자동화",
        subtitle: "AI Agent Workflow & CLI",
        challenge:
          "팀원 간 Git 숙련도 차이로 브랜치 충돌이 잦았고, 코드 리뷰와 문서화가 개발 속도에 병목이 되었습니다.",
        solution:
          "AI Agent 기반의 자동화 파이프라인과 CLI 도구를 개발하여 반복적인 작업을 제거했습니다.",
        details: [
          "**AI Agent Workflow**: Planner-Coder-Reviewer-Documenter 4단계 파이프라인으로 코드 품질 관리",
          "**Smart-commit CLI**: 터미널 명령어 하나로 이슈 생성부터 PR 작성까지 자동화",
          "**Convention Enforcement**: 커밋 메시지, 브랜치 네이밍 규칙 자동 적용",
        ],
        impact: "코드 리뷰 시간 단축 및 문서 최신화 자동화",
      },
      {
        id: "editor-stabilization",
        title: "Tiptap 에디터 인스턴스 안정화",
        subtitle: "useRef 패턴으로 재생성 방지",
        challenge:
          "Tiptap(ProseMirror) 에디터에서 부모 컴포넌트가 리렌더링될 때마다 인스턴스가 재생성되어, 타이핑 도중 커서가 튀거나 한글 입력이 끊기는 현상이 발생했습니다.",
        solution:
          "useRef를 활용하여 에디터 인스턴스를 유지하고, 콜백 함수만 ref를 통해 최신 상태를 참조하도록 구조를 개선했습니다.",
        details: [
          "**Dependency decoupling**: `useEditor` 의존성 배열에서 변동이 잦은 props 제거",
          "**Ref Pattern**: `onUpdate` 콜백을 `useRef`로 관리하여 클로저 문제 해결",
        ],
        impact: "에디터 리렌더링 시 인스턴스 재생성 0회, 커서 튐 완전 제거",
      },
      {
        id: "tree-memoization",
        title: "트리 조립 로직 최적화",
        subtitle: "O(n^2) → O(N)",
        challenge:
          "문서 목록을 트리 구조로 변환하는 재귀 함수가 O(n^2) 복잡도를 가져, 문서가 수백 개일 때 UI 렌더링이 눈에 띄게 느려졌습니다.",
        solution:
          "HashMap을 활용하여 O(N) 복잡도로 트리를 조립하도록 알고리즘을 개선하고, `useMemo`로 원본 데이터가 변경될 때만 재연산하도록 최적화했습니다.",
        details: [
          "**Algorithm**: ID 매핑을 이용한 단일 루프 처리로 중첩 순회 제거",
          "**Memoization**: 참조 동등성을 보장하여 불필요한 리렌더링 방지",
        ],
        impact: "트리 변환 성능 20배 향상, 사이드바 반응성 개선",
      },
    ],

    achievements: [
      {
        metric: "64ms",
        label: "INP (반응속도)",
        description: "Canvas 전환으로 420ms 렌더링 지연 85% 개선",
      },
      {
        metric: "58%",
        label: "번들 감소",
        description: "450KB → 187KB (Code Splitting & Prefetch)",
      },
      {
        metric: "Mobile",
        label: "UX 최적화",
        description: "StoRead 모바일 퍼스트 뷰어 & 터치 인터랙션",
      },
      {
        metric: "DX",
        label: "생산성 향상",
        description: "AI Agent & CLI 도입으로 협업 프로세스 자동화",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: [
          "React 19",
          "TypeScript 5",
          "Vite",
          "Zustand",
          "TanStack Query",
          "TailwindCSS",
        ],
      },
      {
        category: "Visualization",
        items: ["Canvas API", "D3.js", "react-force-graph-2d"],
      },
      {
        category: "Editor & Viewer",
        items: ["Tiptap", "ProseMirror", "Mobile Touch Events"],
      },
      {
        category: "Payment & DX",
        items: ["Toss Payments MCP", "AI Agent (LangGraph)", "Node.js CLI"],
      },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
