import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 작가를 위한 세컨드 브레인 서비스입니다. 에디터에서 집필하면 AI가 글을 분석하고, 월드 페이지에서 인물·관계·사건을 시각화해 볼 수 있습니다. 작성한 글을 바로 배포할 수 있는 sto-read 서비스도 함께 제공해, 독자가 접속해 읽을 수 있습니다.",
    overview:
      "5인 팀에서 프론트엔드를 담당했습니다. 인물 관계도 응답속도를 420 ms에서 64 ms로 개선하고, 초기 번들을 58% 줄여 첫 로딩을 빠르게 만들었습니다. Git 워크플로우 자동화 도구를 만들어 팀 전체의 개발 효율도 높였습니다.",

    keyFocus: {
      headline: "내가 해결한 문제들",
      points: [
        {
          icon: "zap",
          title: "인물 관계도 응답속도 420 ms → 64 ms",
          description:
            "등장인물이 많아지면 관계도 화면이 멈추는 문제가 있었습니다. 그리는 방식을 SVG에서 Canvas로 바꿔서 해결했습니다.",
        },
        {
          icon: "layers",
          title: "첫 화면 로딩 속도 58% 개선",
          description:
            "사용자가 서비스에 접속하면 당장 안 쓰는 기능의 코드까지 전부 내려받고 있었습니다. 필요한 시점에만 로드되도록 분리했습니다.",
        },
        {
          icon: "smartphone",
          title: "모바일 독서 경험 개선",
          description:
            "모바일에서도 소설을 편하게 읽을 수 있도록 전용 뷰어를 만들고 터치 조작을 개선했습니다.",
        },
        {
          icon: "trending-up",
          title: "개발 워크플로우 자동화",
          description:
            "이슈 등록부터 코드 리뷰 반영까지, 개발 과정에서 반복되는 작업을 자동화하는 도구를 만들어 팀에 공유했습니다.",
        },
      ],
    },
    decisions: [
      {
        id: "ADR-001",
        type: "initial",
        decision: "React 19 + TypeScript + Vite",
        reason:
          "SEO보다 에디터·관계도 등 클라이언트 인터랙션이 중요한 서비스였습니다. 팀원 모두 React에 익숙했고, Vite의 빠른 HMR이 생산성에 도움이 될 것으로 판단해 SPA로 결정했습니다.",
        result:
          "SSR 없이 빠른 개발 루프를 유지했고, React 에디터 생태계를 활용할 수 있었습니다.",
      },
      {
        id: "ADR-002",
        type: "development",
        decision: "Tailwind CSS + shadcn/ui",
        reason:
          "작가 도구에 어울리는 차분한 톤의 디자인이 필요했고, 컴포넌트를 직접 수정할 수 있는 구조가 좋겠다고 판단했습니다.",
        result:
          "Radix UI 기반 접근성을 확보하면서 Tailwind로 커스텀 테마를 빠르게 적용할 수 있었습니다.",
      },
      {
        id: "ADR-003",
        type: "development",
        decision: "Zustand + TanStack Query",
        reason:
          "서버 상태와 UI 상태가 섞이면서 리렌더링 추적이 어려워졌습니다. 두 관심사를 명확히 분리할 필요가 있었습니다.",
        result:
          "보일러플레이트가 적어 빠르게 적용할 수 있었고, 낙관적 업데이트로 편집 시 즉각적인 피드백을 줄 수 있었습니다.",
      },
      {
        id: "ADR-004",
        type: "development",
        decision: "Tiptap (ProseMirror)",
        reason:
          "#복선, @캐릭터 멘션 등 커스텀 문법이 필요했습니다. React 생태계 중 확장성이 가장 뛰어난 라이브러리라 선택했습니다.",
        result:
          "커스텀 익스텐션을 만들어 작가에게 꼭 필요한 집필 도구를 구현했습니다.",
      },
      {
        id: "ADR-005",
        type: "development",
        decision: "React Flow → D3.js + Canvas 전환",
        reason:
          "처음에 React Flow로 인물 관계도를 만들었는데, 등장인물이 많아지면 SVG DOM이 늘어나 느려지고 레이아웃 제어에도 한계가 있었습니다.",
        result:
          "Canvas 전환으로 응답속도가 420 ms → 64 ms로 개선됐고, D3.js 물리 엔진으로 인물들이 자연스럽게 배치되도록 만들 수 있었습니다.",
      },
      {
        id: "ADR-006",
        type: "development",
        decision: "Vite manualChunks 번들 분리",
        reason:
          "사용자가 서비스에 접속하면 PDF·Word 내보내기용 라이브러리까지 한꺼번에 내려받고 있었습니다. 대부분의 사용자가 쓰지 않는 기능 때문에 모든 사용자의 첫 로딩이 느려지고 있었습니다.",
        result:
          "접속 시 내려받는 코드량을 450KB에서 187KB로 줄였습니다. 내보내기 같은 기능은 실제로 사용할 때만 로드됩니다.",
      },
      {
        id: "ADR-007",
        type: "development",
        decision: "AI Agent 기반 개발 워크플로우",
        reason:
          "이슈 생성, 브랜치 전환, 커밋, PR 작성 같은 반복 작업에 시간이 많이 들었습니다. 팀원마다 커밋 단위와 PR 품질이 달라서 리뷰 비용도 컸습니다.",
        result:
          "Git 워크플로우 전체를 자동화하고, 작업 규모에 따라 S/M/L로 분류해 적절한 수준의 설계 프로세스를 거치도록 만들었습니다. AI 코드리뷰를 PR에 자동 반영하는 워크플로우도 구축했습니다.",
      },
      {
        id: "ADR-008",
        type: "development",
        decision: "Feature-Slice 폴더 구조",
        reason:
          "코드가 늘어나면서 기능 간 의존이 얽히기 시작했습니다. 도메인별로 관심사를 분리해야 기능 추가가 편해질 것으로 판단했습니다.",
        result:
          "UI, 로직, 데이터 레이어를 분리한 덕분에 새 기능을 추가할 때 기존 코드를 건드릴 일이 줄었습니다.",
      },
    ],

    sections: [
      {
        id: "d3-force-simulation",
        title: "인물 관계도 성능 개선 (React Flow → D3.js + Canvas)",
        subtitle: "등장인물이 많아지면 관계도가 멈추는 문제를 해결했습니다",
        challenge:
          "React Flow로 인물 관계도를 만들었는데, 등장인물이 많아질수록 SVG DOM이 늘어나 렌더링이 느려졌고, 물리 연산도 React 생명주기와 맞지 않았습니다. 인물이 자연스럽게 배치되는 그래프를 그리려면 렌더링 방식과 물리 엔진을 둘 다 바꿔야 했습니다.",
        solution:
          "React Flow를 걷어내고 D3.js Force Simulation + Canvas로 교체했습니다. SVG → Canvas 전환으로 렌더링 성능이 크게 개선됐고, useRef로 물리 상태를 React 렌더링 바깥에 두고 관심사별로 훅을 분리했습니다.",
        details: [
          "**SVG → Canvas**: 노드마다 DOM을 만들던 방식에서 Canvas에 한꺼번에 그리는 방식으로 전환 → 420 ms → 64 ms (성능 개선의 핵심)",
          "**물리 엔진 격리**: D3.js 시뮬레이션 상태를 useRef로 React 렌더링 사이클 밖에서 처리",
          "**훅 분리**: 시뮬레이션, 드래그, 줌, 리사이즈를 각각 전용 훅으로 나눠서 기능 추가·수정이 서로 영향 없이 가능",
        ],
        codeSnippet: `// useCharacterGraphSimulation.ts
const newSimulation = d3
  .forceSimulation<CharacterNode, RelationshipLink>(nodesCopy)
  .force("charge", d3.forceManyBody().strength(-300))
  .force("collision", d3.forceCollide().radius(d => getNodeRadius(d) + 5))
  .alphaDecay(0.02)
  .velocityDecay(0.3);

// 훅 기반 관심사 분리
const { nodes, links } = useCharacterGraphSimulation(rawNodes, rawLinks);
const { dragProps } = useCharacterGraphDrag(simulation);
const { zoomTransform } = useCharacterGraphZoom();`,
        diagram: {
          type: "mermaid",
          content: `graph TB
  subgraph DataLayer["Data Layer"]
    RL["Raw Links"] --- RN["Raw Nodes"]
  end
  subgraph HookLayer["Custom Hook Layer"]
    direction LR
    S["Simulation Hook"] --- D["Drag Hook"]
    D --- Z["Zoom Hook"]
    Z --- R["Resize Hook"]
  end
  subgraph ViewLayer["View Layer (Canvas/SVG)"]
    V["Graph Renderer"]
  end
  DataLayer --> HookLayer
  HookLayer --> ViewLayer`,
          caption: "훅 기반 지식 그래프 엔진 구조",
        },
        impact:
          "등장인물 650명 기준 응답속도 420 ms → 64 ms 개선, 인물 간 관계에 따라 자연스럽게 배치되는 관계도 구현",
      },
      {
        id: "bundle-optimization",
        title: "첫 화면 로딩 속도 58% 개선 (450KB → 187KB)",
        subtitle:
          "대부분이 안 쓰는 기능 때문에 모든 사용자의 첫 로딩이 느렸습니다",
        challenge:
          "초기 JS 번들이 450KB(gzip)였습니다. Export 기능에 쓰이는 jspdf, docx 같은 무거운 라이브러리가 초기에 전부 로드되고 있었고, 대부분의 사용자가 쓰지 않는 기능이었습니다.",
        solution:
          "Vite manualChunks로 라이브러리를 용도별 청크로 분리했습니다. 항상 필요한 것(React, UI)과 가끔 필요한 것(Export, Graph)을 나누고, 라우트 호버 시 prefetch를 걸어 코드 스플리팅으로 인한 지연을 보완했습니다.",
        details: [
          "**청크 분리**: 항상 로드되는 vendor-react, vendor-ui와 필요 시 로드되는 vendor-export 등을 분리",
          "**결과**: 초기 번들 450KB → 187KB, 안 쓰는 라이브러리는 아예 로드되지 않음",
          "**UX 보완**: 라우트 호버 시 prefetch를 적용해 코드 스플리팅 지연을 체감하지 못하게 처리",
        ],
        codeSnippet: `// vite.config.ts
output: {
  manualChunks: {
    "vendor-react": ["react", "react-dom", "react-router-dom"],
    "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-popover"],
    "vendor-editor": ["@tiptap/core", "@tiptap/react", "@tiptap/starter-kit"],
    "vendor-export": ["jspdf", "docx", "canvas-to-blob"], // 대용량 라이브러리 분리
    "vendor-graph": ["d3-force", "d3-drag", "d3-zoom"],
  }
}`,
        impact: "초기 JS 번들 58% 절감 (450KB → 187KB)",
      },
      {
        id: "tiptap-stabilization",
        title: "글쓰기 에디터 한글 입력 끊김 해결",
        subtitle:
          "글을 쓰는 도중 커서가 튀거나 한글이 씹히는 문제가 있었습니다",
        challenge:
          "타이핑 도중 커서가 튀거나 한글 입력이 끊기는 현상이 있었습니다. 원인을 추적해보니 부모 컴포넌트가 리렌더링될 때마다 에디터 인스턴스가 재생성되고 있었습니다.",
        solution:
          "useRef로 에디터 인스턴스를 유지하고, onUpdate 콜백만 ref를 통해 최신 상태를 참조하도록 바꿨습니다. useEditor의 의존성 배열에서 자주 바뀌는 props를 제거한 것이 핵심이었습니다.",
        details: [
          "**원인**: useEditor 의존성 배열에 변동이 잦은 props가 포함되어 있어서 매번 인스턴스 재생성",
          "**해결**: onUpdate 콜백을 useRef로 감싸서 인스턴스는 유지하면서 콜백만 갱신",
        ],
        codeSnippet: `// TiptapEditor.tsx
const onUpdateRef = useRef(onUpdate);
useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

const editor = useEditor({
  extensions,
  onUpdate: ({ editor }) => {
    const textContent = editor.state.doc.textContent;
    onUpdateRef.current?.(textContent.length);
  },
});`,
        impact: "커서 튐과 한글 입력 끊김 해결",
      },
      {
        id: "ai-dx-workflow",
        title: "개발 워크플로우 자동화",
        subtitle: "코드 외적인 반복 작업에 쓰는 시간을 줄이고 싶었습니다",
        challenge:
          "이슈 생성, 브랜치 전략에 맞는 브랜치 생성, 기능별 커밋 분리, PR 작성까지 매번 수동으로 하다 보니 시간이 많이 들었습니다. 팀원마다 커밋 단위와 PR 품질이 달라서 리뷰 비용도 컸습니다.",
        solution:
          "Git 워크플로우 전체를 자동화했습니다. 이슈 생성 → 브랜치 생성·전환 → 기능별 분리 커밋 → 푸시 & PR 작성을 하나의 흐름으로 만들었고, PR에 AI 코드리뷰를 요청한 뒤 리뷰 내용을 읽어와서 반영하는 워크플로우도 구축했습니다. 추가로, 작업 규모를 S/M/L로 판단해 적절한 수준의 설계 프로세스를 거치도록 하는 Supervisor 에이전트도 설계했습니다.",
        details: [
          "**Git 워크플로우 자동화**: 이슈 연결 → 브랜치 생성 → 기능별 커밋 → PR 생성까지 한 번에 처리",
          "**AI 코드리뷰 반영**: PR을 읽어와서 AI에게 리뷰를 요청하고, 피드백을 코드에 반영하는 과정을 자동화",
          "**Supervisor 에이전트**: 작업 규모(S/M/L)에 따라 바로 실행할지, 간단한 설계를 거칠지, 상세 기획서를 작성할지 자동으로 판단",
          "**역할별 에이전트**: 구조 설계, UI, 리팩토링, 품질 검증, 문서 관리 등 역할을 나눠서 각 단계에 적합한 에이전트가 작업",
        ],
        impact:
          "반복 작업에 쓰던 시간을 줄이고, 작업 규모별 설계 프로세스를 통해 팀 전체의 커밋·PR 품질이 일정해짐",
      },
      {
        id: "payments-security",
        title: "결제 금액 위변조 방지",
        subtitle: "프론트엔드가 금액을 결정하지 않는 구조로 설계했습니다",
        challenge:
          "Toss Payments 공식 문서를 참고해 결제 흐름을 설계했습니다. 클라이언트에서 금액을 직접 전달하면 DevTools로 조작할 수 있기 때문에, 처음부터 프론트엔드가 금액을 결정하지 않는 구조로 만들었습니다.",
        solution:
          "결제 금액은 항상 서버가 결정합니다. ① 서버가 주문 정보(금액 포함)를 생성하고 ② 프론트엔드는 서버가 준 금액을 그대로 결제 SDK에 전달하며 ③ 결제 완료 후 서버가 PG사와 직접 통신해 금액을 최종 확인합니다.",
        details: [
          "**금액 신뢰**: 프론트엔드가 아닌 서버 발급 금액만 TossPayments SDK에 전달",
          "**중복 방지**: 결제 참조 ID로 같은 결제가 두 번 처리되지 않도록 처리",
          "**최종 승인**: successUrl 진입 시 프론트엔드 값이 아닌 서버-PG 간 통신으로 확인",
        ],
        impact: "클라이언트 금액 조작이 불가능한 결제 흐름 구축",
      },
    ],

    achievements: [
      {
        metric: "420 ms → 64 ms",
        label: "관계도 응답속도",
        description: "등장인물 650명 기준, SVG → Canvas 전환으로 개선",
      },
      {
        metric: "450 KB → 187 KB",
        label: "초기 JS 번들",
        description: "manualChunks로 용도별 청크 분리",
      },
      {
        metric: "입력 끊김 해결",
        label: "에디터 안정화",
        description: "useRef 패턴으로 인스턴스 재생성 방지",
      },
      {
        metric: "워크플로우 자동화",
        label: "팀 DX 개선",
        description: "이슈 → 브랜치 → 커밋 → PR → AI 리뷰 반영을 자동화",
      },
    ],

    techStack: [
      {
        category: "Frontend Core",
        items: [
          "React 19",
          "TypeScript 5",
          "Vite 7",
          "Zustand",
          "TanStack Query 5",
        ],
      },
      {
        category: "UI & Visualization",
        items: ["Tailwind CSS 3", "shadcn/ui", "D3.js", "HTML5 Canvas API"],
      },
      {
        category: "Editor & Payments",
        items: [
          "Tiptap (ProseMirror)",
          "Toss Payments SDK",
          "Zod",
          "React Hook Form",
        ],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "산모의 마음을 기록하고 AI와 함께 돌보는 육아 플랫폼입니다. 감정 기반 일기 작성, 부모 얼굴 분석을 통한 아기 캐릭터 생성, 맞춤형 AI 피드백을 제공합니다.",
    overview:
      "2인 팀에서 풀스택을 담당했습니다. Spring Boot와 Python Flask를 연동한 하이브리드 아키텍처를 설계하고, 얼굴 분석 → 프롬프트 생성 → 이미지 생성의 End-to-End AI 파이프라인을 구축했습니다.",

    keyFocus: {
      headline: "내가 해결한 문제들",
      points: [
        {
          icon: "cpu",
          title: "하이브리드 AI 아키텍처 설계",
          description:
            "AI 이미지 생성 시 메인 서버가 블로킹되는 문제가 있었습니다. AI 로직을 Python 마이크로서비스로 분리해 메인 서버 응답성을 유지했습니다.",
        },
        {
          icon: "zap",
          title: "End-to-End AI 파이프라인 구축",
          description:
            "얼굴 특징 추출 → 프롬프트 자동 생성 → DALL-E 이미지 생성까지 이어지는 완전한 파이프라인을 설계하고 구현했습니다.",
        },
        {
          icon: "layers",
          title: "상태 관리 일원화",
          description:
            "useState와 전역 상태가 혼재되어 코드가 복잡했습니다. Zustand로 전역 상태를 일원화하고 커스텀 훅으로 로직을 분리했습니다.",
        },
      ],
    },

    decisions: [
      {
        id: "ADR-001",
        type: "initial",
        decision: "Spring Boot + Flask 하이브리드",
        reason:
          "비즈니스 로직과 AI/ML 처리를 하나의 언어로 하기엔 각각의 강점을 살릴 수 없었습니다. Java는 트랜잭션과 보안에, Python은 AI 라이브러리 활용에 특화되어 있어 분리했습니다.",
        result:
          "무거운 AI 연산을 분리해 메인 서버 안정성을 확보했고, 각 언어의 생태계를 최대한 활용할 수 있었습니다.",
      },
      {
        id: "ADR-002",
        type: "development",
        decision: "React + TypeScript + Zustand",
        reason:
          "상태 관리가 복잡해지면서 Redux를 검토했지만, 프로젝트 규모에 비해 보일러플레이트가 과했습니다.",
        result:
          "Zustand로 전역 상태를 간결하게 관리하고, 커스텀 훅으로 비즈니스 로직을 View에서 분리했습니다.",
      },
      {
        id: "ADR-003",
        type: "development",
        decision: "Docker Compose 오케스트레이션",
        reason:
          "Backend, Frontend, AI Service, Database를 각각 관리하면 환경 설정이 복잡해집니다.",
        result:
          "전 계층을 Docker Compose로 묶어 실행 가능한 문서(Infrastructure as Code)를 구현했습니다.",
      },
    ],

    sections: [
      {
        id: "hybrid-architecture",
        title: "Spring Boot + Flask 하이브리드 아키텍처",
        subtitle: "AI 연산으로 메인 서버가 블로킹되지 않는 구조를 설계했습니다",
        challenge:
          "AI 이미지 생성에 수십 초가 걸리는데, 이 동안 메인 서버 스레드가 차단되어 다른 요청을 처리할 수 없었습니다. 단일 서버로는 AI 처리와 일반 비즈니스 로직을 모두 감당하기 어려웠습니다.",
        solution:
          "AI 로직을 별도 Python Flask 서비스로 분리했습니다. Spring Boot가 비즈니스 로직과 보안을 담당하고, Flask가 얼굴 분석과 이미지 생성을 담당합니다. RestTemplate으로 두 서비스 간 통신 파이프라인을 구축했습니다.",
        details: [
          "**역할 분리**: Spring Boot는 트랜잭션/보안, Flask는 AI/ML 처리 전담",
          "**서비스 간 통신**: RestTemplate 기반 동기 호출로 단순하게 구현",
          "**응답성 확보**: AI 연산이 메인 서버를 블로킹하지 않음",
        ],
        impact: "AI 연산 중에도 메인 서버 응답성 유지",
      },
      {
        id: "ai-pipeline",
        title: "얼굴 분석 → 캐릭터 생성 AI 파이프라인",
        subtitle: "부모 사진에서 특징을 추출해 아기 캐릭터를 생성합니다",
        challenge:
          "단순히 OpenAI API를 호출하는 것만으로는 일관된 품질의 캐릭터를 만들 수 없었습니다. 사용자가 업로드한 얼굴 사진에서 특징을 추출하고, 이를 프롬프트로 변환하는 전처리 과정이 필요했습니다.",
        solution:
          "End-to-End 파이프라인을 구축했습니다. face-cli로 얼굴 특징점(눈, 코, 입, 얼굴형)을 JSON으로 추출하고, 이를 기반으로 DALL-E에 최적화된 프롬프트를 자동 생성합니다.",
        details: [
          "**얼굴 분석**: Hugging Face API로 얼굴 특징 JSON 추출",
          "**프롬프트 엔지니어링**: 추출된 특징을 DALL-E용 프롬프트로 자동 변환",
          "**캐릭터 생성**: DALL-E 3 호출로 최종 이미지 생성",
        ],
        codeSnippet: `# 얼굴 분석 → 프롬프트 생성 → 이미지 생성 파이프라인
def generate_character(parent_images):
    # 1. 얼굴 특징 추출
    features = extract_face_features(parent_images)

    # 2. DALL-E 최적화 프롬프트 생성
    prompt = generate_dalle_prompt(features)

    # 3. 캐릭터 이미지 생성
    return call_dalle_api(prompt)`,
        impact: "부모 사진 기반 일관된 품질의 아기 캐릭터 생성",
      },
      {
        id: "state-management",
        title: "Zustand + Custom Hooks로 상태 관리 일원화",
        subtitle: "복잡해진 상태 관리를 정리하고 로직을 분리했습니다",
        challenge:
          "useState와 전역 상태가 섞이면서 코드가 복잡해졌습니다. Prop Drilling 문제도 발생했고, 같은 상태를 여러 컴포넌트에서 관리하면서 버그가 생기기 쉬웠습니다.",
        solution:
          "Zustand로 전역 상태(사용자 세션, 모달 등)를 일원화하고, 비즈니스 로직은 커스텀 훅(useCharacter, useDiary 등)으로 분리했습니다. View 컴포넌트는 렌더링에만 집중하도록 만들었습니다.",
        details: [
          "**전역 상태 일원화**: 중복되는 상태를 Zustand 스토어로 통합",
          "**커스텀 훅 분리**: useCharacter, useDiary 등으로 비즈니스 로직 캡슐화",
          "**View 단순화**: 컴포넌트는 UI 렌더링에만 집중",
        ],
        codeSnippet: `// useCharacter.ts - 비즈니스 로직 분리
export const useCharacter = () => {
  const { character, setCharacter } = useStore();

  const generateCharacter = async (images: File[]) => {
    const result = await characterApi.generate(images);
    setCharacter(result);
  };

  return { character, generateCharacter };
};`,
        impact: "코드 복잡도 감소, 로직 재사용성 향상",
      },
    ],

    achievements: [
      {
        metric: "하이브리드 아키텍처",
        label: "서비스 분리",
        description: "Spring Boot + Flask로 AI 연산과 비즈니스 로직 분리",
      },
      {
        metric: "End-to-End 파이프라인",
        label: "AI 파이프라인",
        description: "얼굴 분석 → 프롬프트 생성 → 이미지 생성 자동화",
      },
      {
        metric: "상태 일원화",
        label: "코드 품질",
        description: "Zustand + 커스텀 훅으로 상태 관리 정리",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: ["React 18", "TypeScript", "Zustand", "Tailwind CSS"],
      },
      {
        category: "Backend",
        items: ["Spring Boot 3.4", "Flask", "JPA", "MariaDB"],
      },
      {
        category: "AI & Infra",
        items: ["OpenAI API (DALL-E 3)", "Docker Compose", "AWS EC2"],
      },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
