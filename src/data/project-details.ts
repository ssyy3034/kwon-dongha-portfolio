import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "SVG→Canvas 마이그레이션으로 INP 16배 개선, 번들 최적화로 초기 로딩 60% 단축",
    overview:
      "5인 개발팀의 웹소설 작가용 플랫폼에서 프론트엔드 전체를 단독 담당했습니다. 노드 30개에서 멈추던 관계도 그래프를 600개 이상 처리 가능하도록 Canvas로 전환하고, Vite 번들 최적화로 초기 로딩을 60% 단축했습니다.",

    keyFocus: {
      headline: "핵심 성과 (Chrome DevTools 측정)",
      points: [
        {
          icon: "zap",
          title: "INP 16.3배 향상",
          description:
            "SVG→Canvas 마이그레이션으로 응답 속도 1,048ms → 64ms 개선. Style Recalculation 935ms/frame을 0ms로 완전 제거했습니다.",
        },
        {
          icon: "layers",
          title: "초기 로딩 60% 감소",
          description:
            "Vite manualChunks로 Export/Graph 라이브러리를 Lazy Load 처리. 초기 JS 450KB → 187KB(gzip) 달성했습니다.",
        },
      ],
    },

    sections: [
      {
        id: "canvas-migration",
        title: "SVG → Canvas 마이그레이션",
        subtitle: "렌더링 성능 16배 개선",
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
        title: "트리 변환 메모이제이션",
        subtitle: "O(n log n) → O(1)",
        challenge:
          "문서 트리 사이드바에서 노드 클릭/호버마다 Flat Array → Nested Tree 변환 함수(buildTree)가 매번 실행되었습니다. Map 생성 O(n) + 관계 연결 O(n) + 정렬 O(n log n) 과정으로, 문서 수백 개일 때 단순 클릭에도 15~20ms 연산이 발생하여 UI 반응성이 저하되었습니다.",
        solution:
          "useMemo와 참조 동등성(Referential Equality)을 활용하여 데이터가 실제로 변경되었을 때만 트리 변환을 수행하도록 최적화했습니다.",
        details: [
          "Before: 렌더링마다 buildTree(documents) 실행 → 매번 15~20ms 소요",
          "After: useMemo(() => buildTree(documents), [documents]) → 참조 변경 시에만 재연산",
          "불변성(Immutability) 원칙 덕분에 내용이 같으면 참조도 같음이 보장됨",
        ],
        impact: "연산 비용 제거 (O(n log n) → O(1)), 반응성 극대화",
      },
      {
        id: "ai-workflow",
        title: "AI 에이전트 워크플로우 자동화",
        subtitle: "개발 워크플로우 자동화",
        challenge:
          "5인 팀 개발 중 Git 숙련도 격차로 인한 브랜치 충돌, 이슈 트래킹 누락, 구두 합의된 컨벤션 미준수 등 협업 비효율이 발생했습니다.",
        solution:
          "이슈 생성부터 PR까지의 수명주기를 자동화하는 'Smart-Commit' CLI와, 작업 크기에 따라 최적의 프롬프트를 주입하는 'Supervisor Agent' 시스템을 구축했습니다.",
        details: [
          "Smart-Commit: Staging된 변경사항을 분석하여 Conventional Commits 메시지 및 이슈 연결 자동화",
          "Supervisor Agent: 작업 명세를 분석하여 Stylist/Architect 등 전문 에이전트에게 최소한의 Context만 동적 주입",
          "Quality Gates: 'Design Compliance'를 포함한 3단계 자동 감사를 통해 코드와 디자인 품질 집중 검증",
        ],
        impact:
          "개인 도구로 시작하여 4팀 중 3팀(15/20명)으로 확산, 기수 전체 생산성 견인",
      },
    ],

    achievements: [
      {
        metric: "1048 → 64ms",
        label: "드래그 응답 시간",
        description:
          "SVG→Canvas 전환으로 DOM 조작 제거, Chrome DevTools Performance 탭에서 측정",
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
        metric: "O(n log n) → O(1)",
        label: "트리 변환 최적화",
        description: "useMemo + 참조 동등성으로 데이터 변경 시에만 트리 재구성",
      },
      {
        metric: "100%",
        label: "표준 준수",
        description:
          "자동화된 워크플로우 도입으로 온보딩 비용 제거 및 코드 품질 표준화",
      },
    ],

    techStack: [
      { category: "Core", items: ["React 19", "TypeScript 5.7", "Vite"] },
      { category: "State", items: ["Zustand (17 stores)", "TanStack Query"] },
      {
        category: "Visualization",
        items: ["Canvas API", "D3.js", "react-force-graph-2d"],
      },
      {
        category: "Editor",
        items: ["Tiptap (16개 커스텀 익스텐션)", "ProseMirror"],
      },
      { category: "Storage", items: ["IndexedDB (idb-keyval)"] },
    ],
  },

  pintos: {
    id: "pintos",
    tagline:
      "8-depth Priority Donation, Widowed Frame 디버깅, Demand Paging 기반 메모리 관리",
    overview:
      "하드웨어 위에서 직접 동작하는 교육용 운영체제의 핵심 모듈을 구현했습니다. 우선순위 역전 해결, 무한 Page Fault 디버깅, 가상 메모리 관리 등 저수준 시스템 문제를 해결하며 CS 기초 역량을 확보했습니다.",

    keyFocus: {
      headline: "핵심 성과",
      points: [
        {
          icon: "layers",
          title: "전체 테스트 All Pass",
          description:
            "Threads 25개 + User Programs 76개 + Virtual Memory 40개 테스트 전체 통과",
        },
        {
          icon: "cpu",
          title: "저수준 디버깅 경험",
          description:
            "소프트웨어-하드웨어 상태 불일치(Widowed Frame) 문제를 GDB로 추적하여 해결",
        },
      ],
    },

    sections: [
      {
        id: "priority-donation",
        title: "Priority Donation: 8-depth 중첩 락 체인 해결",
        subtitle: "우선순위 역전(Inversion) 현상의 근본적 해결",
        challenge:
          "높은 우선순위(H) 스레드가 낮은 우선순위(L) 스레드가 점유한 락을 기다릴 때, 중간 우선순위(M) 스레드가 L을 선점해버리면 H가 무한정 대기하는 우선순위 역전이 발생했습니다.",
        solution:
          "Priority Donation 메커니즘을 설계하고 구현했습니다. 락 대기 시 보유자에게 우선순위를 기부하고, 중첩된 락 대기 상황까지 재귀적으로 전파합니다.",
        details: [
          "Donation: 락 대기 시 보유자에게 자신의 높은 우선순위를 일시적으로 기부",
          "Chain Handling: Nested Donation까지 재귀적으로 전파 (depth limit: 8)",
          "Revert: 락 해제 시 기부받은 우선순위 반납 및 본래 우선순위로 복귀",
        ],
        impact: "donate-nest/chain 테스트 통과",
      },
      {
        id: "widowed-frame",
        title: "Widowed Frame 디버깅: 무한 Page Fault 해결",
        subtitle: "소프트웨어-하드웨어 상태 불일치 문제 추적",
        challenge:
          "mmap된 메모리 접근 시 Page Fault가 무한 반복되며 프로세스가 exit(-1)로 강제 종료되었습니다. page->frame은 존재하지만 실제 PML4 매핑은 없는 '고아 프레임' 상태였습니다.",
        solution:
          "vm_do_claim_page에서 프레임 존재 여부만 확인하던 로직에 PML4 매핑 검증을 추가했습니다. 고아 상태 감지 시 pml4_set_page로 매핑을 복구합니다.",
        details: [
          "Before: page->frame != NULL이면 true 반환 → PML4 매핑 누락 시 무한 루프",
          "After: pml4_get_page로 하드웨어 매핑 검증 → 누락 시 pml4_set_page로 복구",
          "GDB로 Page Fault Handler 진입점 추적하여 원인 특정",
        ],
        impact: "mmap-* 테스트 전체 통과",
      },

      {
        id: "demand-paging",
        title: "Demand Paging: 가상 공간 확장 및 지연 로딩",
        subtitle: "Page Fault 기반 지연 로딩 전략",
        challenge:
          "프로세스 실행 시 모든 세그먼트를 메모리에 올리면 물리 메모리가 금방 부족해지는 문제가 있었습니다.",
        solution:
          "Page Fault가 발생했을 때만 해당 페이지를 로드하는 Demand Paging을 구현했습니다.",
        details: [
          "Supplemental Page Table (SPT): 페이지 메타데이터(디스크 위치, 쓰기 가능 여부) 관리",
          "Page Fault Handler: 디스크에서 데이터를 읽어 물리 프레임에 매핑 후 재시작",
          "Stack Growth: rsp 레지스터 감시하여 스택 영역 접근 시 자동 페이지 할당",
        ],
        impact: "한정된 물리 메모리 극복 및 가상 공간 활용",
      },
    ],

    achievements: [
      {
        metric: "4개 모듈",
        label: "OS 핵심 기능 구현",
        description: "Threads, User Programs, Virtual Memory, File System",
      },
      {
        metric: "GDB 디버깅",
        label: "Widowed Frame 해결",
        description:
          "SW-HW 상태 불일치로 인한 무한 Page Fault를 GDB로 추적하여 수정",
      },
    ],

    techStack: [
      { category: "Language", items: ["C (C99)", "x86 Assembly"] },
      { category: "Environment", items: ["Linux (Ubuntu)", "QEMU Emulator"] },
      { category: "Tools", items: ["GDB (Kernel Debugging)", "Makefile"] },
      {
        category: "Concepts",
        items: [
          "Virtual Memory",
          "Paging",
          "Multi-threading",
          "Synchronization",
        ],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "Spring Boot + Python Flask 마이크로서비스, Docker Compose로 6개 컨테이너 구성",
    overview:
      "AI 기반 육아 기록 플랫폼의 전체 스택을 담당했습니다. 프론트엔드에서는 Zustand + Custom Hooks로 상태를 관리하고, 백엔드에서는 Spring Boot와 Python Flask를 분리하여 AI 연산과 비즈니스 로직을 분리했습니다.",

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
        id: "frontend-state",
        title: "프론트엔드 상태 관리 구조화",
        subtitle: "Zustand + Custom Hooks",
        challenge:
          "다수의 useState와 prop drilling으로 인해 상태 흐름을 파악하기 어려웠습니다. 같은 데이터를 여러 컴포넌트에서 중복 관리하고 있었습니다.",
        solution:
          "Zustand 스토어 기반으로 전역 상태를 일원화하고, Custom Hooks로 비즈니스 로직을 View에서 분리했습니다.",
        details: [
          "Zustand 스토어로 전역 상태 중앙 관리",
          "useCharacter.ts 등 도메인별 Custom Hooks로 로직 분리",
          "Single Source of Truth 원칙 적용",
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
          "Spring Boot: 비즈니스 로직, 트랜잭션, 보안/인증",
          "Python Flask: face-cli, OpenAI API 등 AI 연산",
          "RestTemplate: 서비스 간 HTTP 통신",
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
          "face-cli로 얼굴 특징점을 추출하고, 이를 자연어 프롬프트로 변환하여 DALL-E 3에 전달하는 파이프라인을 구축했습니다.",
        details: [
          "Input: 부모 사진 업로드",
          "Preprocessing: face-cli로 얼굴 특징점 추출",
          "Prompt Engineering: 특징 → 자연어 프롬프트 변환",
          "Generation: DALL-E 3 API 호출",
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
        category: "Frontend",
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
