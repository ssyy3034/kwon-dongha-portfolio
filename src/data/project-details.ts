import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 작가를 위한 세컨드 브레인 서비스입니다. 에디터에서 집필하면 AI가 글을 분석하고, 월드 페이지에서 인물·관계·사건을 시각화합니다. 독자는 StoRead에서 관계도와 함께 작품을 열람할 수 있습니다.",
    overview:
      "크래프톤 정글 최종 프로젝트, 5인 팀. 프론트엔드 전체(에디터·관계도·사이드바·대시보드)와 백엔드 일부(OAuth2 인증·문서 CRUD·결제 시스템)를 담당했습니다. 가장 도전적이었던 부분은 인물이 수백 명으로 늘어도 버티는 관계도 렌더링과, 테스트 결제 환경에서의 동시성 제어 및 잔액 정합성이었습니다.",

    sections: {
      backend: [
        {
          id: "n1-query",
          title: "계층형 문서 조회 N+1 쿼리",
          subtitle: "API 응답 450ms → 25ms (18배 개선)",
          problem:
            "**사이드바 문서 목록 조회에서 쿼리 61개가 발생하고, 응답시간이 450ms까지 느려졌습니다.**\n문서 30개를 조회할 때 '문서 1번 → 태그 30번 → 카테고리 30번' 패턴으로 총 61개 쿼리가 나가고 있었습니다. JPA Lazy Loading 특성상 데이터가 적을 때는 드러나지 않다가, 문서가 쌓이면서 전형적인 N+1 패턴이 표면화된 것입니다.\n- 실측 응답시간 **450ms**, 사이드바 열 때 뚜렷한 지연 체감\n- 쿼리 로그 확인 후 원인 특정",
          approach:
            "**DTO Projection으로 엔티티 그래프를 우회하고, JPA Fetch Join과 In-Memory 트리 구성을 통해 계층 구조를 효율적으로 조회했습니다.**\n원인은 문서를 조회한 뒤 각 문서의 태그와 카테고리를 개별 SELECT로 가져오는 구조였습니다. `@BatchSize`로 IN 쿼리 묶음을 먼저 시도했지만 2-3회 왕복이 여전했고, Fetch Join은 OneToMany + Pageable 조합에서 HHH90003004 경고(메모리 전체 로딩)가 발생해 쓸 수 없었습니다. 결국 JPQL 생성자 표현식으로 필요 컬럼만 DTO에 직접 매핑하는 방식으로 전환해 N+1을 구조적으로 차단했습니다.\n- 폴더 트리는 Fetch Join으로 전체 데이터를 조회한 뒤 메모리에서 Map을 활용해 O(n)으로 조립\n- `@BatchSize` → Fetch Join → In-Memory 트리 구성 순서로 접근법 비교 후 결정",
          result:
            "**쿼리 61개 → 1개, 응답 450ms → 25ms로 18배 개선됐습니다.**\n사이드바 체감 속도가 달라지는 걸 팀원들도 바로 느꼈습니다. 쿼리 수가 줄면서 DB 부하 자체가 낮아져 전체 시스템 안정성도 높아졌습니다.",
          retrospective:
            "Fetch Join의 페이지네이션 제약을 미리 알았다면 처음부터 DTO Projection으로 설계했을 텐데, 이미 엔티티 기반으로 짜인 코드를 전부 DTO로 바꾸는 데 예상보다 시간이 많이 들었습니다. 초기에는 Recursive CTE를 검토했으나, DB 벤더 간 문법 차이와 쿼리 복잡성을 고려하여 최종적으로 'Fetch Join + In-Memory 조립' 방식을 채택했습니다. 이 과정에서 기술적 트레이드오프(쿼리 단순성 vs 메모리 사용량)를 깊이 고민해 볼 수 있었습니다. 앞으로는 데이터 규모와 요구사항에 따라 QueryDSL이나 네이티브 쿼리 등 최적의 도구를 유연하게 선택하는 역량을 더 키우고자 합니다.",
          details: [
            "**문제 감지**: API 모니터링 로그에서 단일 엔드포인트에 60+ 쿼리 발생 확인",
            "**@BatchSize 시도**: IN 쿼리로 묶어도 2-3회 왕복 발생, 근본 해결 아님",
            "**Fetch Join 함정**: OneToMany + Pageable 조합에서 HHH90003004 경고 → 메모리 전체 로딩 위험",
            "**DTO Projection 전환**: JPQL 생성자 표현식으로 필요 컬럼만 직접 매핑, N+1 구조적 차단",
            "**In-Memory 트리 구성**: Fetch Join으로 로드된 Flat 데이터를 메모리에서 O(n) 트리로 조립",
          ],
          impact: "450ms → 25ms (18배)",
        },
        {
          id: "connection-pool",
          title: "결제 PG 외부 API 호출로 인한 DB 커넥션 풀 고갈",
          subtitle: "결제 시스템 장애 격리",
          problem:
            "**트랜잭션 안에서 PG API를 호출하는 구조로, 동시 결제 10건이면 커넥션 풀이 고갈될 위험이 있었습니다.**\n결제 승인 로직이 '트랜잭션 안에서 PG API 호출 → DB 저장'을 하나의 흐름으로 묶고 있었습니다. HikariCP 기본 풀은 10개인데 토스페이먼츠 테스트 API 응답시간이 1-2초라, 결제 10건만 동시에 들어오면 모든 커넥션이 PG 응답을 기다리는 상태로 묶입니다. 일반 API(문서 조회, 에디터 저장)까지 `Connection is not available` 오류가 발생할 수 있는 구조였습니다.\n- 코드 리뷰 중 이 구조적 위험을 발견",
          approach:
            "**네트워크 I/O와 DB 트랜잭션을 분리했습니다.**\n수정된 흐름은 이렇습니다: ① 먼저 PG API를 호출해 승인 결과를 받고(트랜잭션 없음), ② 승인 성공 확인 후 트랜잭션을 열어 크레딧을 처리합니다. ③ PG가 성공인데 DB 처리가 실패하는 엣지 케이스를 위해 PG 취소 API를 보상 트랜잭션으로 준비했습니다. 외부 API가 아무리 느려도 DB 커넥션을 물고 있지 않으니, 결제 지연이 다른 기능으로 전파되지 않습니다.",
          result:
            "**PG 응답 지연이 DB 커넥션 풀에 영향을 주지 않는 구조로 전환됐습니다.**\n테스트 환경에서 결제 API에 지연을 주입해도 문서 조회, 에디터 저장 같은 일반 API가 정상 동작하는 것을 확인했습니다. 장애의 파급 범위가 결제 기능에만 격리되는 설계입니다.",
          retrospective:
            "'트랜잭션 안에서 외부 API 호출 금지'는 백엔드 설계의 기본 원칙인데, 초기 구현에서 놓쳤다가 코드 리뷰 과정에서 발견해 수정했습니다. 현재 구조에서도 PG사가 완전히 다운됐을 때를 대비한 회로 차단기(Circuit Breaker)가 없습니다. Resilience4j를 적용해 PG 연속 실패 시 빠른 실패(Fail Fast)와 사용자에게 명확한 안내 메시지를 주는 것이 다음 단계입니다.",
          details: [
            "**원인 분석**: HikariCP 기본 풀(10개) × PG 응답대기(1-2s) = 10건 동시 결제 시 풀 고갈",
            "**분리 원칙**: @Transactional 범위 밖에서 PG API 호출 완료 후 트랜잭션 시작",
            "**보상 트랜잭션**: PG 승인 후 DB 실패 시 PG 취소 API 호출로 정합성 확보",
            "**장애 격리 검증**: 결제 API 지연 중 일반 API 정상 응답 직접 확인",
          ],
          impact: "결제 장애 → 전체 서비스 전파 차단",
        },
        {
          id: "concurrency",
          title: "크레딧 결제 동시성 제어와 멱등성 보장",
          subtitle: "100 스레드 동시 요청 / 잔액 정합성 100% 검증",
          problem:
            "**동시 결제 시 Race Condition으로 잔액이 음수가 되거나, 네트워크 재시도로 이중 차감이 발생할 수 있는 구조였습니다.**\n잔액 100크레딧 상태에서 50크레딧 결제가 동시에 두 건 들어오면, 둘 다 '100 읽음 → 50 차감 → 50 저장'을 실행해 잔액이 음수가 될 수 있습니다. 또한 네트워크 불안정으로 클라이언트가 같은 결제를 재시도하면 이중 차감이 발생할 위험도 있었습니다. 테스트 결제 환경이지만 실서비스와 동일한 수준의 정합성을 목표로 설계했습니다.",
          approach:
            "**비관적 락 + 낙관적 락으로 경쟁 조건을, 멱등키(Redis)로 중복 결제를 각각 방어했습니다.**\n문제의 성격이 달라서 방어 레이어를 나눴습니다. `SELECT FOR UPDATE`로 잔액 행을 잠가 동시 읽기를 직렬화하고, Version 컬럼으로 쓰기 충돌을 감지합니다. 중복 결제는 클라이언트 고유 키를 Redis에 저장해 DB 진입 전에 차단합니다.\n- **Testcontainers**로 실제 PostgreSQL을 띄워 검증 (Mock DB에서는 락 동작 신뢰 불가)\n- 100 스레드 동시 차감 시나리오를 10회 반복 실행",
          result:
            "**100개 스레드 동시 차감에서 10회 반복 모두 잔액 정합성 100%를 확인했습니다.**\n동일 멱등키로 들어오는 중복 요청은 DB 트랜잭션 시작 전에 즉시 차단됩니다. 이 테스트 코드가 CI에 포함되어 결제 코드 변경 시 회귀를 자동으로 감지합니다.",
          retrospective:
            "비관적 락과 낙관적 락을 같이 쓰는 구조가 처음 보는 사람에게는 복잡하게 느껴질 수 있습니다. 두 락의 역할이 각각 '동시 읽기 방지'와 '쓰기 충돌 감지'로 다르다 보니 함께 필요했는데, 주석과 문서를 더 꼼꼼히 달았어야 했습니다. 서비스가 멀티 인스턴스로 Scale-out 되면 단일 DB 비관적 락으로는 한계가 생기는 문제도 있습니다. 이때는 Redis 기반 분산 락으로 전환하거나 결제를 별도 서비스로 분리하는 방향을 검토해야 합니다.",
          details: [
            "**비관적 락**: `SELECT ... FOR UPDATE`로 잔액 행 잠금 → 동시 읽기 자체를 직렬화",
            "**낙관적 락**: Version 컬럼으로 동시 쓰기 충돌 감지 → 충돌 시 재시도",
            "**멱등키**: 클라이언트 고유 키를 Redis에 저장, 중복 요청은 DB 진입 전 차단",
            "**Testcontainers**: 실제 PostgreSQL + 100 스레드 동시 요청으로 정합성 검증 (Mock DB 불신뢰)",
            "**CI 통합**: 동시성 테스트를 파이프라인에 포함해 결제 코드 변경 시 회귀 자동 감지",
          ],
          impact: "100 스레드 동시 / 잔액 정합성 100%",
        },
      ],
      frontend: [
        {
          id: "d3-canvas",
          title: "인물 관계도 렌더링 (React Flow → D3.js + Canvas)",
          subtitle: "응답속도 420ms → 64ms, 650명 환경에서 실시간 인터랙션",
          problem:
            "**React Flow로 구현한 관계도가 인물 100명을 넘어가면서 렌더링 420ms, 드래그 끊김이 발생했습니다.**\nReact Flow는 노드 하나마다 SVG `<g>` 요소를 DOM에 만드는데, 650명 기준으로 DOM 노드가 크게 늘어납니다. 거기다 작가가 원하는 '인물 간 친밀도에 따라 자연스럽게 가까이 모이는 배치'도 React Flow의 레이아웃 엔진으로는 불가능했습니다.\n- 렌더링 **420ms** + 드래그 프레임 드롭으로 인터랙션 불가능",
          approach:
            "**D3.js Force Simulation + Canvas API로 전환하고, useRef로 시뮬레이션을 React 사이클 밖에 격리했습니다.**\nWebGL(난이도 과잉), D3+SVG(DOM 문제 동일), D3+Canvas를 비교해 Canvas를 선택했습니다. Canvas는 DOM 없이 픽셀을 직접 그리기 때문에 노드 수가 늘어나도 비용이 선형으로만 증가합니다. D3 Force Simulation 상태를 `useRef`에 격리하고 `requestAnimationFrame`으로 Canvas를 직접 갱신해, 매 프레임 React 리렌더링 없이 물리 시뮬레이션을 돌렸습니다.\n- useSimulation / useDrag / useZoom / useResize 훅으로 관심사 분리",
          result:
            "**650명 기준 렌더링 420ms → 64ms (6.5배 개선), 드래그·줌 끊김 없이 동작합니다.**\nForce Simulation이 관계 강도를 인력/척력으로 표현하기 때문에, 관계가 깊은 인물은 자연스럽게 가까이 모이고 관련 없는 인물은 멀어집니다. 작가가 원했던 '관계도다운' 레이아웃을 얻을 수 있었습니다.",
          retrospective:
            "Canvas 렌더링의 단점이 하나 있습니다. SVG와 달리 Canvas 위의 요소는 DOM이 아니라서 스크린 리더가 읽지 못합니다. 지금은 접근성 지원이 없는 상태인데, ARIA live region이나 Canvas 위에 투명한 DOM 레이어를 올리는 방식으로 보완이 필요합니다. 또 Canvas 위에서 특정 노드를 클릭할 때 좌표 계산을 직접 해야 해서, 이 로직에 버그가 생기면 잡기가 꽤 까다롭습니다. 히트 테스트 로직을 별도 유닛 테스트로 커버했어야 했는데 시간 부족으로 하지 못했습니다.",
          details: [
            "**WebGL vs D3+SVG vs D3+Canvas 비교**: 난이도·성능·물리엔진 지원을 기준으로 D3+Canvas 선택",
            "**DOM 제거**: 650 노드 기준 SVG 650개 → Canvas 픽셀 직접 드로잉으로 렌더링 비용 선형화",
            "**물리 격리**: useRef로 D3 시뮬레이션 상태를 React 사이클 밖에 두고, rAF으로 Canvas 갱신",
            "**훅 분리**: useSimulation(물리) / useDrag(이동) / useZoom(확대) / useResize(반응형) 독립 운용",
          ],
          codeSnippet: `// useCharacterGraphSimulation.ts
// D3 시뮬레이션을 React 사이클 밖에 격리
const simulationRef = useRef<d3.Simulation<CharacterNode, RelationshipLink>>();

useEffect(() => {
  simulationRef.current = d3
    .forceSimulation<CharacterNode>(nodesCopy)
    .force("charge", d3.forceManyBody().strength(-300))   // 인물 간 척력
    .force("link", d3.forceLink(links).distance(120))     // 관계 강도 → 거리
    .force("collision", d3.forceCollide().radius(getNodeRadius))
    .on("tick", () => {
      // React state 없이 Canvas 직접 갱신
      drawGraph(canvasRef.current, simulationRef.current);
    });
}, []); // deps 비움 → 마운트 시 1회만 생성`,
          impact: "420ms → 64ms (6.5배)",
        },
        {
          id: "bundle-split",
          title: "초기 JS 번들 최적화",
          subtitle: "450KB → 187KB (58% 절감), FCP 4.2s → 1.8s",
          problem:
            "**Lighthouse FCP 4.2초. 사용 빈도가 낮은 Export 라이브러리(260KB+)가 초기 번들에 통으로 들어 있었습니다.**\nVite 빌드 분석(rollup-plugin-visualizer)을 돌려보니, `jspdf`와 `docx` 같은 Export 전용 라이브러리가 초기 번들의 57%를 차지하고 있었습니다. Export는 사용 빈도가 낮은 부가 기능이라 대부분의 페이지 진입에서 쓰지 않는 코드를 매번 내려받는 구조였습니다.",
          approach:
            "**Vite `manualChunks`로 라이브러리를 용도별 청크로 분리하고, hover prefetch로 지연감을 제거했습니다.**\n`React.lazy()`로 라우트 단위 스플리팅을 먼저 시도했지만, 무거운 라이브러리들이 여러 기능에 걸쳐 공유되어 중복 번들이 발생했습니다. manualChunks로 vendor-core(React) / vendor-ui(Radix) / vendor-export(jspdf/docx) / vendor-graph(d3)로 직접 분류하고, 라우트 hover 시 해당 청크를 미리 prefetch하는 커스텀 Link를 구현했습니다.",
          result:
            "**초기 번들 450KB → 187KB (58% 절감), FCP 4.2s → 1.8s로 개선됐습니다.**\nExport 라이브러리는 실제 Export 버튼을 클릭할 때만 로드되고, prefetch 덕에 지연감이 없습니다. 이후 기능을 추가할 때도 어떤 청크에 들어갈지 의식적으로 분류하게 되는 좋은 습관이 생겼습니다.",
          retrospective:
            "manualChunks 설정을 파일로 따로 빼지 않고 vite.config.ts 안에 인라인으로 뒀더니, 나중에 패키지가 추가될 때 설정을 업데이트하는 걸 깜빡하는 일이 생겼습니다. 청크 분류 기준을 명확히 문서화하거나, 새 패키지 추가 시 청크 배정을 강제하는 CI 검사를 넣었으면 좋았을 것 같습니다. 또 SSR을 지원했다면 서버에서 HTML을 먼저 내려서 FCP를 더 빠르게 할 수 있었는데, 이 서비스는 에디터와 Canvas 위주의 클라이언트 인터랙션이 많아 SPA로 결정한 것 자체는 맞다고 생각합니다.",
          details: [
            "**병목 발견**: rollup-plugin-visualizer로 번들 시각화 → jspdf+docx가 초기 번들의 57% 차지 확인",
            "**React.lazy 시도**: 라우트 기준 스플리팅 시 라이브러리 중복 번들 발생, manualChunks로 전환",
            "**청크 분류**: vendor-core(React), vendor-ui(Radix), vendor-editor(Tiptap), vendor-export(jspdf/docx), vendor-graph(d3)",
            "**Prefetch 적용**: 라우트 hover 시 해당 청크 미리 로드, 코드 스플리팅 지연감 제거",
          ],
          impact: "450KB → 187KB / FCP 4.2s → 1.8s",
        },
        {
          id: "tiptap-stability",
          title: "Tiptap 에디터 한글 입력 끊김",
          subtitle: "커서 튐과 글자 씹힘 해결",
          problem:
            "**한글을 빠르게 입력하면 글자가 씹히거나 커서가 앞으로 튀는 현상이 발생했습니다.**\n영문에서는 재현이 안 돼서 한글 IME Composition 이벤트와 React 리렌더링 간 충돌을 의심했습니다. useEditor 소스를 직접 열어보니, `onUpdate` 콜백이 deps에 포함되어 있어 부모 리렌더링마다 에디터 인스턴스가 `destroy()` 후 재생성되고 있었습니다. 한글 조합 중에 이 재생성이 트리거되면 조합이 강제 종료됩니다.",
          approach:
            "**useRef로 콜백을 감싸 에디터 인스턴스 재생성을 방지했습니다. (Event Handler Ref 패턴)**\n`useRef`로 `onUpdate` 콜백을 보관하고 `useEffect`로 최신 props를 ref에 동기화합니다. `useEditor`의 `onUpdate`에서는 ref를 통해 호출하므로, deps에서 자주 바뀌는 props를 제거할 수 있습니다. React 공식 문서의 Event Handler Ref 패턴과 동일한 방식입니다.",
          result:
            "**한글 조합 중 리렌더링이 발생해도 에디터 인스턴스가 유지되어, 커서 튐과 글자 씹힘이 해소됐습니다.**\n부모 컴포넌트가 상태를 얼마나 자주 업데이트해도 에디터는 영향받지 않습니다. 마운트 시 1회만 인스턴스를 생성합니다.",
          retrospective:
            "증상만 보고 원인을 추측해서 여러 방향으로 시도하다 시간을 꽤 썼습니다. 처음부터 ProseMirror와 IME Composition Event의 관계를 공식 문서에서 찾아봤으면 더 빨리 해결했을 것입니다. 또 이 버그는 macOS에서만 한글 입력기를 쓸 때 나타나서 Windows 환경에서 테스트할 때는 발견이 안 됐습니다. 다양한 OS와 입력기 조합으로 테스트 매트릭스를 넓히는 습관을 가져야겠다고 생각했습니다.",
          codeSnippet: `// TiptapEditor.tsx — Event Handler Ref 패턴으로 인스턴스 재생성 방지
const onUpdateRef = useRef(onUpdate);
useLayoutEffect(() => {
  onUpdateRef.current = onUpdate;  // 매 렌더마다 최신 콜백으로 동기화
});

const editor = useEditor({
  extensions,
  // onUpdate에 ref를 통해 호출 → useEditor deps에서 onUpdate 제거 가능
  onUpdate: ({ editor }) => {
    onUpdateRef.current?.(editor.state.doc.textContent.length);
  },
  // deps 배열에 변동이 잦은 props 없음 → 마운트 시 1회만 인스턴스 생성
});`,
          impact: "한글 입력 끊김 해결",
        },
      ],
    },

    achievements: [
      {
        metric: "450ms → 25ms",
        label: "문서 조회 API",
        description: "N+1 쿼리 61개 → 1개, 18배 개선",
      },
      {
        metric: "100스레드 / 100%",
        label: "결제 잔액 정합성",
        description: "비관/낙관적 락 + 멱등키, Testcontainers 검증",
      },
      {
        metric: "420ms → 64ms",
        label: "인물 관계도",
        description: "SVG → Canvas, 650명 환경 실시간 인터랙션",
      },
      {
        metric: "450KB → 187KB",
        label: "초기 JS 번들",
        description: "58% 절감, FCP 4.2s → 1.8s",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: [
          "React 19",
          "TypeScript",
          "Vite",
          "D3.js",
          "Canvas API",
          "Tiptap",
          "Zustand",
          "TanStack Query",
        ],
      },
      {
        category: "Backend",
        items: ["Spring Boot", "JPA", "PostgreSQL", "Neo4j"],
      },
      {
        category: "테스트",
        items: ["JUnit 5", "Testcontainers", "Toss Payments SDK"],
      },
      {
        category: "Tools",
        items: ["Git", "GitHub Actions"],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "산모가 일기를 쓰면 AI가 감정을 분석해 피드백을 제공하는 서비스입니다. 부모 사진으로 아기 캐릭터를 생성하는 기능도 함께 제공합니다.",
    overview:
      "캡스톤 디자인 프로젝트(2인 팀)로 시작해 크래프톤 정글 수료 후 개인적으로 성능 개선을 이어갔습니다. 백엔드 전체(인증·일기 CRUD·AI 처리·캐싱)와 프론트엔드 일부를 담당했습니다. Python 전용 AI 라이브러리가 필요해 Spring Boot + Flask 이중 서버로 구성했고, AI 처리 병목 해결이 이 프로젝트의 가장 큰 기술적 도전이었습니다.",

    sections: {
      backend: [
        {
          id: "rabbitmq-async",
          title: "AI 이미지 합성 동기 블로킹 → RabbitMQ 비동기 전환",
          subtitle: "WAS 수락률 1.16 → 1,949 TPS, 202 응답 30s → 4.9ms",
          problem:
            "**ML 이미지 합성(~30초)이 Tomcat I/O 스레드를 직접 점유해, 동시 사용자 10~20명에서 서비스 전체가 마비되는 Cascade Failure가 발생했습니다.**\nFlask ML 추론을 `RestTemplate`으로 동기 호출하는 구조에서, `ThreadPoolTaskExecutor`의 maxPool(10)이 30초씩 점유됩니다. queue(25)까지 포화되면 `CallerRunsPolicy`가 발동되어 Tomcat 스레드마저 Flask를 직접 호출하게 됩니다.\n- k6 부하 테스트 실측 최대 처리량: **1.16 TPS**\n- 이미지 합성 외 일기 작성·건강 기록 등 무관한 API까지 전부 무응답",
          approach:
            "**RabbitMQ로 WAS와 AI 처리를 분리하고, 3중 멱등성 가드로 중복 처리를 방지했습니다.**\n먼저 `@Async` + `ConcurrentHashMap`으로 시도했지만 두 가지 구조적 한계가 드러났습니다. WAS 힙에 상태를 저장하면 Scale-out 시 인스턴스 간 불일치가 발생하고, 결과 조회 후에도 Map에서 `byte[]`를 제거하지 않아 GC 후에도 +28MB가 잔류하는 메모리 누수도 확인했습니다. 상태 관리를 외부 시스템에 위임해야 한다는 결론에 도달해 RabbitMQ를 도입했습니다.\n- Spring Boot(Producer): 큐 발행 → 즉시 202 Accepted (4.9ms)\n- Python Worker(Consumer): `prefetch_count=1` + 수동 ACK로 큐 소비 → Webhook 결과 전달\n- DLQ로 Worker 장애 시 메시지 보존\n- at-least-once delivery 대응: Worker → Controller → Store 3중 멱등성 가드",
          result:
            "**WAS 수락률 1.16 → 1,949 TPS (1,680배), 202 응답 레이턴시 30,000ms → 4.9ms**\nAI 처리가 아무리 오래 걸려도 WAS는 영향받지 않습니다. 서버 재시작 시에도 큐에 남은 메시지가 보존돼 작업이 유실되지 않습니다.\n- 500 VU 부하에서 p95 318ms, 에러율 **0%**\n- 총 175,463건 처리, API 수락률 100%",
          retrospective:
            "Webhook 방식을 채택하다 보니 클라이언트가 주기적으로 상태를 폴링해야 합니다. UX 관점에서는 '생성 요청 → 기다림 → 완료 알림'이 깔끔하지 않고, 폴링 요청도 불필요하게 생깁니다. SSE(Server-Sent Events)나 WebSocket으로 서버에서 직접 완료 이벤트를 푸시하는 방식이 더 나았을 것 같습니다. 또 Python Worker 프로세스에 대한 헬스 체크나 모니터링이 없어서, Worker가 죽어도 바로 알 수 없는 약점이 있습니다. Prometheus + Grafana 같은 모니터링 스택을 붙이면 이 부분을 보완할 수 있습니다.",
          details: [
            "**@Async 시도 → 한계**: ConcurrentHashMap 메모리 누수(GC 후 +28MB 잔류) + Scale-out 시 상태 불일치",
            "**Producer(Spring Boot)**: 요청 수신 → 큐 발행 → 즉시 202 Accepted (4.9ms)",
            "**Consumer(Python Worker)**: prefetch_count=1 + 수동 ACK, MediaPipe → AI 이미지 생성 → Webhook 콜백",
            "**DLQ**: 처리 실패 메시지 별도 보관, 장애 복구 후 수동 재처리",
            "**3중 멱등성**: Worker 중복 소비 차단 → Controller 중복 webhook 차단 → Store 최후 방어선",
          ],
          diagram: {
            type: "mermaid",
            content: `sequenceDiagram
  participant C as Client
  participant W as WAS (Spring Boot)
  participant Q as RabbitMQ
  participant P as Python Worker
  C->>+W: POST /characters/generate
  W->>Q: 작업 메시지 발행
  W-->>-C: 202 Accepted (4.9ms)
  Q->>+P: 메시지 소비 (prefetch=1)
  Note over P: MediaPipe 특징 추출<br/>AI 이미지 생성 (~30s)
  P->>P: basic_ack()
  P->>-W: POST /webhook/character (완료 콜백)
  W->>C: 폴링으로 완료 알림`,
            caption: "RabbitMQ 비동기 처리 흐름 — WAS와 AI 처리 분리",
          },
          impact: "1.16 → 1,949 TPS (1,680배)",
        },
        {
          id: "n1-circular",
          title: "JPA N+1과 순환 참조가 겹쳐 발생한 API 무응답",
          subtitle: "쿼리 21개 → 1개 단축, StackOverflowError 해결",
          problem:
            "**`Diary` 엔티티를 API 응답에 직접 반환하면서 순환 참조(StackOverflowError)와 N+1(21쿼리)이 동시에 터져 API가 무응답이 됐습니다.**\n`Diary.user`가 `FetchType.EAGER`로 설정되어 있어, 일기 10건 조회 시 diary 1 + user 10 + child 10 = 총 21쿼리가 발생했습니다. 동시에 양방향 연관관계를 Jackson이 무한히 따라가며 직렬화를 시도해 서버가 비정상 종료됐습니다.\n- `Diary → User → List<Diary> → User → ...` 순환 참조로 StackOverflowError\n- 도메인 엔티티가 API 경계를 넘는 설계 문제가 두 이슈의 근본 원인",
          approach:
            "**Response DTO로 계층 책임을 분리하고, DTO Projection + `default_batch_fetch_size` 안전망을 적용했습니다.**\n`@JsonIgnore`로 순환을 억제하는 건 증상 완화일 뿐이라 기각하고, 엔티티가 API 경계를 넘지 않도록 전용 DTO를 분리했습니다. 전 연관관계를 `FetchType.LAZY`로 전환하고, JPQL 생성자 표현식으로 필요 컬럼만 DTO에 직접 매핑해 엔티티 그래프를 타지 않도록 했습니다.\n- 소유자 검증(수정·삭제)에만 `@EntityGraph`로 명시적 Fetch Join\n- `default_batch_fetch_size=100`으로 DTO Projection 미적용 경로의 안전망 확보",
          result:
            "**쿼리 21개 → 1개(필요 컬럼만 SELECT, JOIN 없음), StackOverflowError 해결**\nDTO 반환으로 응답 payload 크기도 줄어들었고, 응답 스키마 변경 시 DTO만 수정하면 되는 구조로 유지보수성이 향상됐습니다.\n- 엔티티 전 필드 노출 위험(password 등) → DTO에 명시한 필드만 노출\n- 엔티티가 Jackson에 의존하는 구조 → DTO로 분리",
          retrospective:
            "JPA 엔티티를 API 응답에 그대로 노출하는 패턴의 위험성을 실제 장애를 통해 배웠습니다. 처음부터 엔티티와 DTO를 분리해 설계했으면 이 두 문제 모두 생기지 않았을 것입니다. 사실 양방향 관계 자체를 최대한 피하고 단방향으로만 설계하는 것이 더 안전합니다. 조회가 복잡해지는 경우에는 QueryDSL을 쓰거나, 아예 읽기 전용 Repository를 분리하는 방향(CQRS 패턴의 간소화 버전)도 고려해볼 만합니다.",
          details: [
            "**문제 발견**: JPA SQL 로그로 10건 조회 시 21쿼리 확인 + StackOverflowError 발생",
            "**@JsonIgnore 검토 후 기각**: 엔티티가 Jackson에 의존하는 증상 완화, 근본 해결 아님",
            "**DTO Projection**: JPQL 생성자 표현식으로 필요 컬럼만 직접 매핑 → 순환 참조 구조 제거",
            "**@EntityGraph**: 소유자 검증(수정·삭제)에만 명시적 Fetch Join 사용",
            "**전역 안전망**: `default_batch_fetch_size=100`으로 미적용 경로의 N+1 배치 변환",
          ],
          impact: "쿼리 21개 → 1개 / StackOverflowError 해결",
        },
        {
          id: "multi-layer-cache",
          title: "주차별 맞춤 정보 — 컨텍스트 기반 개인화 + 다층 캐시",
          subtitle: "Caffeine + Redis + DB 3계층 캐시, 사용자별 맞춤 응답",
          problem:
            "**임신 주차 정보가 모든 산모에게 동일한 응답을 반환해, 개인화된 서비스를 제공하지 못하고 있었습니다.**\n기존 구현은 주차 번호만으로 Gemini를 호출해 42주 고정 콘텐츠를 생성하는 구조였습니다. 같은 20주차라도 최근 감정이 불안한 산모와 안정적인 산모가 동일한 정보를 받고 있었고, 체중·혈압 등 건강 데이터도 반영되지 않았습니다. 42주 고정 콘텐츠는 DB에 저장하면 끝이라 캐시 계층의 근거도 약했습니다.",
          approach:
            "**산모의 일기 감정 분석 이력과 건강 기록을 Gemini 프롬프트에 주입해 개인화하고, 사용자×주차×컨텍스트 조합의 다양성에 대응하는 3계층 캐시를 설계했습니다.**\n`UserContextService`가 최근 7일 일기 감정 빈도와 최신 건강 기록을 수집해 요약 텍스트를 생성합니다. 이 컨텍스트를 SHA-256으로 해싱해 캐시 키(`userId:contextHash`)로 사용합니다. 동일한 컨텍스트(감정·건강 상태 변화 없음)에는 캐시가 HIT되고, 일기를 쓰거나 건강 기록이 바뀌면 해시가 달라져 자동으로 새 Gemini 호출이 발생합니다.\n- **L1 Caffeine**: 200 엔트리, 2분 TTL — 동일 사용자 반복 조회 시 네트워크 홉 없이 응답\n- **L2 Redis**: 24h + Jitter TTL — 서버 간 공유, 캐시 스탬피드 방지\n- **L3 DB**: `PersonalizedWeekContent` 엔티티로 영속화 — 서버 재시작·Redis 장애 시에도 유실 없음\n- 컨텍스트 미입력 사용자는 기존 42주 공통 캐시로 Fallback",
          result:
            "**같은 주차라도 산모의 감정·건강 상태에 따라 다른 맞춤 응답을 제공하며, 3계층 캐시로 반복 요청 시 Gemini API 비용을 절감합니다.**\n개인화로 사용자×주차×컨텍스트 조합이 다양해져 캐시가 실질적으로 필요한 구조가 됐습니다. DB 영속화 덕에 Redis 장애나 서버 재시작에도 기존 응답을 즉시 복원할 수 있습니다.",
          retrospective:
            "컨텍스트 해시가 감정·건강 데이터의 정확한 값에 의존하기 때문에, 체중이 0.1kg만 변해도 새 캐시 엔트리가 생깁니다. 값을 구간(예: 60~62kg)으로 양자화하면 캐시 히트율을 높일 수 있었을 것입니다. 또한 현재는 L3 DB 조회가 contextHash 기반 단건 조회라 인덱스만으로 충분하지만, 사용자 수가 크게 늘면 오래된 엔트리를 주기적으로 정리하는 배치가 필요합니다.",
          details: [
            "**컨텍스트 수집**: 최근 7일 일기 감정 빈도 + 최신 체중·혈압 → 요약 텍스트 생성",
            "**캐시 키 설계**: SHA-256(userId + week + emotions + healthData) → 상태 변화 시 자동 무효화",
            "**L1 Caffeine**: maximumSize 200, 2분 TTL — 활성 사용자 반복 조회 최적화",
            "**L2 Redis**: 24h + 2h Jitter TTL — 서버 간 공유, 캐시 스탬피드 방지",
            "**L3 DB 영속화**: PersonalizedWeekContent 엔티티, 서버 재시작·Redis 장애 복원용",
            "**Fallback 전략**: 컨텍스트 미입력 → 42주 공통 캐시, Redis 장애 → DB → Gemini 직접 호출",
          ],
          impact: "개인화 응답 + Gemini API 호출 최소화",
        },
        {
          id: "redis-cache",
          title: "오늘의 질문 — 매 요청 Gemini API 호출 → Redis 날짜 기반 캐싱",
          subtitle: "응답 487ms → 3ms (히트율 99.99%)",
          problem:
            "**'오늘의 질문'이 요청마다 Gemini API를 호출해 매번 다른 질문을 생성하는 기능 결함이 있었고, 응답도 avg 487ms로 느렸습니다.**\n기획 의도는 하루에 하나의 질문을 모든 산모가 공유하는 것이었는데, 구현을 확인해보니 요청마다 Flask → Gemini API를 동기 호출하고 있었습니다.\n- 같은 날인데 요청마다 다른 질문 생성 → '오늘의 질문' 기능 의미 자체가 무너짐\n- API 비용이 요청 수에 비례해 선형 증가 (사용자 100명 = Gemini 100번 호출)",
          approach:
            "**날짜 자체를 Redis 키로, 자정까지 남은 시간을 TTL로 설정해 하루 1회만 Gemini API를 호출하도록 했습니다.**\n`daily_question:{yyyyMMdd}` 형태로 키를 설계하면 날짜가 바뀌는 순간 자동으로 만료되어, 별도 스케줄러 없이 다음 날 첫 요청이 새 질문을 생성합니다.\n- HIT 시 Redis에서 ~1ms 즉시 반환, AI API 호출 없음\n- MISS(하루 첫 요청)에만 Flask → Gemini 호출 (~500ms, 하루 1번만)\n- 캐시 무효화 전략이 필요 없음 — 날짜 변경 자체가 무효화",
          result:
            "**응답 487ms → 3ms (162배 개선), 실측 히트율 99.99% (hits 8,294 / misses 1)**\n모든 산모가 같은 날 동일한 질문을 받아 기능 일관성이 확보됐습니다.\n- Gemini API 호출: 요청 수 비례(N:N) → **일 1회로 고정**\n- 기능 결함(요청마다 다른 질문)도 캐싱으로 동시 수정",
          retrospective:
            "자정에 키가 만료되면서 첫 번째 요청이 Gemini API를 호출하게 됩니다. 이 시점에 동시 요청이 있으면 Cache Thundering Herd 문제가 발생할 수 있습니다. 자정 직전에 다음 날 질문을 미리 캐싱하는 스케줄러를 붙였으면 더 안전했을 것입니다. 또 Redis가 다운될 때를 대비한 fallback 전략이 없어서, Gemini API를 직접 호출하는 graceful degradation을 추가하면 장애 전파를 방지할 수 있습니다.",
          details: [
            "**기능 결함 발견**: 같은 날인데 요청마다 다른 질문 생성 → 캐싱으로 기능 결함과 성능을 동시에 해결",
            "**키 설계**: `daily_question:{yyyyMMdd}`, TTL = 자정까지 남은 초",
            "**자동 무효화**: 날짜 변경 자체가 캐시 무효화 → 스케줄러 불필요",
            "**실측**: keyspace_hits 8,294 / keyspace_misses 1 (히트율 99.99%)",
          ],
          impact: "487ms → 3ms (히트율 99.99%)",
        },
      ],
      frontend: [
        {
          id: "web-worker",
          title: "이미지 압축 메인 스레드 블로킹 → Web Worker 분리",
          subtitle: "UI Freezing 2초 → 0, 모바일 로딩 애니메이션 정상화",
          problem:
            "**사진 2장을 Canvas API로 압축하는 동안 메인 스레드가 최대 2초간 블록되어, UI 전체가 멈추고 로딩 애니메이션도 정지했습니다.**\n부모 사진 2장(각 3-5MB)을 AI 서버로 보내기 전에 리사이즈·압축하는 로직이 메인 스레드에서 동기로 실행되고 있었습니다. JavaScript는 싱글 스레드라 압축 중 이벤트 루프 전체가 블록됩니다. 로딩 애니메이션까지 멈추기 때문에 앱이 멈춘 것처럼 보이는 문제였고, 모바일에서는 더 심각했습니다.",
          approach:
            "**Web Worker 2개로 사진을 병렬 압축하여 메인 스레드 블로킹을 제거했습니다.**\nOffscreenCanvas를 먼저 검토했지만 당시 모바일 브라우저 지원이 불충분해 기각했습니다. Worker A(아빠 사진)와 Worker B(엄마 사진)를 동시에 돌려 병렬 압축하고, `postMessage`로 완료된 Blob을 메인 스레드로 전달합니다. `Promise.all`로 두 Worker 완료를 기다렸다가 AI 서버로 전송합니다.",
          result:
            "**UI Freezing이 해소되고, 로딩 애니메이션이 정상 동작합니다.**\n사진 처리 중에도 다른 UI 조작이 가능하고, 두 사진을 병렬 압축하기 때문에 순차 처리 대비 시간도 단축됐습니다. 모바일에서도 매끄럽게 동작합니다.",
          retrospective:
            "Worker 2개를 항상 생성하는 방식이라 사진이 1장만 업로드될 경우 Worker 하나가 낭비됩니다. 업로드 파일 수에 따라 Worker를 동적으로 생성하거나, Worker Pool을 만들어 재사용하는 게 더 효율적입니다. 또 Worker와 메인 스레드 간 이미지 데이터를 복사하는 과정에서 메모리 사용량이 일시적으로 두 배가 됩니다. `Transferable Objects`를 사용해 복사 대신 소유권을 이전하면 이 오버헤드를 없앨 수 있는데, 당시에는 이 API를 몰라서 적용하지 못했습니다.",
          details: [
            "**OffscreenCanvas 검토 후 기각**: 모바일 브라우저 지원 불충분 (당시 기준)",
            "**Worker 2개 병렬**: 아빠 사진 Worker A, 엄마 사진 Worker B 동시 압축",
            "**postMessage 통신**: 압축 완료된 Blob을 메인 스레드로 전달",
            "**Promise.all 조합**: 두 Worker 완료를 기다렸다가 AI 서버로 동시 전송",
            "**개선 여지**: Transferable Objects로 메모리 복사 없이 소유권 이전 가능",
          ],
          impact: "UI Freezing 2초 → 0 / 병렬 압축으로 처리 시간 단축",
        },
        {
          id: "zustand-hooks",
          title: "상태 관리 혼재로 인한 Prop Drilling과 상태 불일치",
          subtitle: "Zustand + 커스텀 훅으로 관심사 분리",
          problem:
            "**캐릭터 상태를 5단계 Prop Drilling으로 전달하고, 여러 컴포넌트가 같은 데이터를 각자 useState로 복사해 상태 불일치 버그가 발생했습니다.**\n프리뷰·저장·공유 컴포넌트가 모두 캐릭터 이미지에 접근해야 하는데, 공통 부모에 useState를 두고 5단계까지 props로 내려보내고 있었습니다. 같은 데이터를 여러 곳에서 복사해 들고 있으니 한 곳에서만 업데이트되고 나머지는 stale 상태로 남는 버그가 생겼고, 기능 추가 시 상태 흐름 파악에 시간이 더 걸렸습니다.",
          approach:
            "**Zustand로 전역 상태를 단일화하고, 비즈니스 로직을 커스텀 훅으로 캡슐화했습니다.**\nRedux는 보일러플레이트가 2인 프로젝트에 과했고, Context API는 값 변경 시 구독 컴포넌트 전체가 리렌더링되는 문제가 있어 Zustand를 선택했습니다. 스토어를 함수 하나로 정의하고 slice 단위로 구독하면 보일러플레이트 없이 필요한 상태만 반응합니다. 서버 상태는 SWR 방식으로 분리하고, `useCharacter`, `useDiary` 같은 커스텀 훅으로 비즈니스 로직을 View 밖으로 분리했습니다.",
          result:
            "**5단계 Prop Drilling이 사라지고, 상태 불일치 버그가 해소됐습니다.**\n어떤 컴포넌트에서든 `useCharacterStore()`로 캐릭터 상태에 바로 접근하며, 한 스토어에서 상태를 일관되게 관리합니다. 새 기능을 추가할 때 기존 컴포넌트를 거의 건드리지 않아도 됩니다.",
          retrospective:
            "처음에 도메인 구분 없이 하나의 큰 스토어를 만들었더니, 프로젝트가 커지면서 스토어가 비대해졌습니다. `useCharacterStore`, `useDiaryStore`, `useUserStore`처럼 도메인별로 나눴으면 관심사가 더 명확해졌을 것입니다. 또 Zustand 스토어는 테스트 시 초기화가 번거로울 수 있는데, 각 테스트마다 스토어를 리셋하는 헬퍼 함수를 처음부터 만들어 두었으면 좋았겠습니다.",
          details: [
            "**Redux 기각**: 액션·리듀서·셀렉터 보일러플레이트가 2인 프로젝트 규모에 과잉",
            "**Context API 기각**: 값 변경 시 구독 컴포넌트 전체 리렌더링 부담",
            "**Zustand 선택**: 스토어 함수 정의 → 필요한 곳에서 직접 구독, slice 단위 리렌더링",
            "**서버/클라이언트 상태 분리**: API 응답은 SWR 스타일로, UI 상태만 Zustand 관리",
            "**커스텀 훅 캡슐화**: useCharacter, useDiary로 비즈니스 로직을 View 밖으로 분리",
          ],
          impact: "Prop Drilling 제거 / 상태 불일치 버그 해소",
        },
      ],
    },

    achievements: [
      {
        metric: "1.16 → 1,949 TPS",
        label: "WAS 수락률",
        description: "RabbitMQ 비동기 전환, 500 VU / p95 318ms / 에러율 0%",
      },
      {
        metric: "487ms → 3ms",
        label: "오늘의 질문 API",
        description: "Redis 날짜 기반 캐싱, 히트율 99.99%, Gemini 일 1회",
      },
      {
        metric: "21쿼리 → 1쿼리",
        label: "일기 목록 조회",
        description: "DTO Projection + 계층 책임 분리, StackOverflowError 해결",
      },
      {
        metric: "3계층 캐시",
        label: "주차별 맞춤 정보",
        description: "감정·건강 컨텍스트 개인화, Caffeine + Redis + DB",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: ["React", "TypeScript", "Zustand", "Web Worker API"],
      },
      {
        category: "Backend",
        items: [
          "Spring Boot",
          "JPA",
          "MariaDB",
          "RabbitMQ",
          "Redis",
          "Caffeine",
        ],
      },
      {
        category: "AI",
        items: ["Flask", "MediaPipe", "Gemini 2.5 Flash"],
      },
      {
        category: "Infra",
        items: [
          "Docker Compose",
          "AWS EC2",
          "S3",
          "CloudFront",
        ],
      },
      {
        category: "Tools",
        items: ["Git", "GitHub Actions"],
      },
    ],
  },
};

export function getProjectDetail(id: string): ProjectDetail | undefined {
  return projectDetails[id];
}
