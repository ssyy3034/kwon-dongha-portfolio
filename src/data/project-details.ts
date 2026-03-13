import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 작가를 위한 세컨드 브레인 서비스입니다. 에디터에서 집필하면 AI가 글을 분석하고, 월드 페이지에서 인물·관계·사건을 시각화합니다. 독자는 StoRead에서 관계도와 함께 작품을 열람할 수 있습니다.",
    architectureImage: "/images/stolink-arch.png",
    overview:
      "크래프톤 정글 최종 프로젝트, 5인 팀. 프론트엔드 일부(에디터·관계도·사이드바·대시보드)와 백엔드 일부(OAuth2 인증·문서 CRUD·결제 시스템)를 담당했습니다. 가장 도전적이었던 부분은 인물이 수백 명으로 늘어도 버티는 관계도 렌더링 성능 최적화와, 오버엔지니어링을 지양하며 즉각적인 성능 개선을 이뤄낸 점이었습니다.",

    sections: {
      backend: [
        {
          id: "n1-query",
          title: "계층형 문서 조회 N+1 → Fetch Join + In-Memory 트리",
          subtitle: "API 응답 450ms → 25ms (18배 개선)",
          problem:
            "**사이드바 문서 목록 조회에서 쿼리가 대량 발생하고, 응답시간이 450ms까지 느려졌습니다.**\n문서 30개를 조회할 때 각 문서의 부모(parent) 관계를 Lazy Loading으로 개별 SELECT하는 구조여서, 문서 수에 비례해 쿼리가 늘어나는 N+1 문제가 발생했습니다.\n- 실측 응답시간 **450ms**, 사이드바 열 때 뚜렷한 지연 체감\n- 쿼리 로그 확인 후 원인 특정",
          approach:
            "**Fetch Join으로 1쿼리 로드 후, HashMap O(n) 트리 조립으로 해결했습니다.**\n`@BatchSize`도 검토했지만, 사이드바 트리는 전체 문서가 항상 필요해 부분 로딩의 이점이 없었습니다. Fetch Join으로 전체 로드 후 `DocumentTreeResponse.from()`으로 필요 필드만 DTO에 매핑해 엔티티 그래프 탐색을 차단했습니다.\n스크리브닝 모드(무한 스크롤)는 Pageable이 필요해 Fetch Join 시 메모리 경고가 발생, 네이밍 쿼리로 분리해 해결했습니다.",
          result:
            "**쿼리 61개 → 1개, 응답 450ms → 25ms로 18배 개선.**\nChrome DevTools Network 탭에서 응답 시간을 측정해 확인.",
          retrospective:
            "'트리 전체 조회'와 '페이징 필요한 스크리브닝 모드'를 같은 쿼리로 처리하려다 HHH90003004를 만났는데, 용도별로 쿼리를 분리하니 각각 최적의 전략을 적용할 수 있었습니다. 이 경험에서 '한 쿼리로 모든 케이스를 커버하려는 욕심'보다 용도별 분리가 성능과 유지보수에도 좋다는 것을 배웠습니다.",
          details: [
            "**용도별 쿼리 분리**: 사이드바 트리 = Fetch Join(페이징 불필요) / 스크리브닝 = Spring Data 네이밍 쿼리 + Pageable",
            "**HHH90003004 회피**: 스크리브닝에서 Fetch Join + Pageable 시도 → 메모리 전체 로딩 경고 → 쿼리 분리로 해결",
            "**In-Memory 트리 구성**: Fetch Join으로 Flat 데이터 로드 후 HashMap O(n) 트리 조립",
          ],
          codeSnippet: `// DocumentRepository.java — Fetch Join으로 1쿼리 조회
@Query("SELECT d FROM Document d LEFT JOIN FETCH d.parent WHERE d.project = :project ORDER BY d.order ASC")
List<Document> findByProjectWithParent(@Param("project") Project project);

// DocumentService.java — HashMap으로 O(n) 트리 조립
private List<DocumentTreeResponse> buildTreeInMemory(List<Document> documents) {
    Map<UUID, DocumentTreeResponse> dtoMap = new HashMap<>();
    List<DocumentTreeResponse> roots = new ArrayList<>();

    for (Document doc : documents) {
        dtoMap.put(doc.getId(), DocumentTreeResponse.from(doc));
    }
    for (Document doc : documents) {
        DocumentTreeResponse dto = dtoMap.get(doc.getId());
        if (doc.getParent() == null) {
            roots.add(dto);                                    // ← 루트 노드
        } else {
            dtoMap.get(doc.getParent().getId()).getChildren().add(dto);  // ← O(1) 연결
        }
    }
    return roots;
}`,
          impact: "450ms → 25ms (18배)",
        },
        {
          id: "connection-pool",
          title: "결제 PG 외부 API 호출에 의한 DB 커넥션 풀 고갈 방지",
          subtitle: "트랜잭션-외부 I/O 분리로 장애 격리",
          problem:
            "**트랜잭션 안에서 PG API를 호출하는 구조로, 동시 결제 10건이면 커넥션 풀이 고갈될 위험이 있었습니다.**\n결제 승인 로직이 하나의 트랜잭션 안에서 토스페이먼츠 API를 동기 호출하고 있었습니다. HikariCP 기본 풀은 10개인데 PG 응답이 1~2초 소요되므로, 동시 결제 10건이면 일반 API(문서 조회, 에디터 저장)까지 커넥션 부족 오류가 발생할 수 있는 구조였습니다.",
          approach:
            "**네트워크 I/O와 DB 트랜잭션을 분리했습니다.**\nTX1에서 검증+상태 전환 후 커밋(커넥션 반환) → 트랜잭션 밖에서 PG API 호출(커넥션 미점유) → TX2에서 승인 결과 반영. PG 승인 후 TX2 실패 시 보상 트랜잭션(PaymentCompensation)으로 정합성 대비.",
          result:
            "**PG 응답 지연이 DB 커넥션 풀에 영향을 주지 않는 구조로 전환.**\n결제 API에 지연을 주입해도 일반 API가 정상 동작하는 것을 확인. 장애가 결제 기능에만 격리됩니다.",
          retrospective:
            "'트랜잭션 안에서 외부 API 호출 금지'는 백엔드 설계의 기본 원칙인데, 초기 구현에서 놓쳤다가 코드 리뷰 과정에서 발견해 수정했습니다. 현재 구조에서도 PG사가 완전히 다운됐을 때를 대비한 회로 차단기(Circuit Breaker)가 없습니다. Resilience4j를 적용해 PG 연속 실패 시 빠른 실패(Fail Fast)와 사용자에게 명확한 안내 메시지를 주는 것이 다음 단계입니다.",
          details: [
            "**보상 트랜잭션**: PG 승인 후 TX2 실패 시 PG 취소 API 호출로 정합성 확보 — 분리 구조의 엣지 케이스 대응",
            "**장애 격리 검증**: 결제 API에 지연 주입 후 일반 API(문서 조회·에디터 저장) 정상 응답 직접 확인",
          ],
          diagram: {
            type: "mermaid",
            content: `sequenceDiagram
  participant C as Client
  participant W as WAS (Spring Boot)
  participant PG as 토스페이먼츠 API
  participant DB as DB (PostgreSQL)

  rect rgb(254, 226, 226)
  Note over W,DB: Before — 트랜잭션 안에서 PG 호출
  C->>+W: POST /payments/confirm
  W->>+DB: BEGIN TX + SELECT FOR UPDATE
  W->>+PG: confirmPayment (1~2s 대기)
  Note over DB: ⚠️ 커넥션 점유 중
  PG-->>-W: 승인 결과
  W->>DB: credit.charge() + COMMIT
  DB-->>-W: OK
  W-->>-C: 200 OK
  end

  rect rgb(220, 252, 231)
  Note over W,DB: After — 트랜잭션 밖에서 PG 호출
  C->>+W: POST /payments/confirm
  W->>+DB: TX1: 검증 + 상태 IN_PROGRESS
  DB-->>-W: COMMIT (즉시 반환)
  W->>+PG: confirmPayment (커넥션 미점유)
  PG-->>-W: 승인 결과
  W->>+DB: TX2: credit.charge() + 완료 처리
  DB-->>-W: COMMIT
  W-->>-C: 200 OK
  Note over W: PG 실패 시 TX2에서 fail 처리
  end`,
            caption:
              "트랜잭션-외부 API 분리 — PG 응답 대기 중 DB 커넥션을 점유하지 않음",
          },
          codeSnippet: `// PaymentService.java — TX1 → PG 호출(Non-TX) → TX2 분리 흐름
// ① TX1: 검증만 수행하고 커넥션 즉시 반환
Payment payment = transactionTemplate.execute(status -> {  // ← 짧은 TX
    Payment p = paymentRepository.findByOrderIdWithLock(orderId);
    p.markAsInProgress(paymentKey);
    return p;
});  // ← COMMIT — 여기서 커넥션 반납

// ② Non-TX: PG API 호출 — DB 커넥션을 점유하지 않음
tossResponse = tossPaymentClient.confirmPayment(  // ← 1~2초 대기해도 안전
        paymentKey, orderId, amount, orderId);

// ③ TX2: PG 승인 결과를 DB에 반영
return completePaymentProcess(orderId, paymentKey, tossResponse.method());`,
          impact: "결제 장애 → 전체 서비스 전파 차단",
        },
        {
          id: "concurrency",
          title: "크레딧 결제 동시성 제어와 멱등성 보장",
          subtitle: "100 스레드 동시 요청 / 잔액 정합성 100% 검증",
          problem:
            "**동시 결제 시 Race Condition으로 잔액이 음수가 되거나, 네트워크 재시도로 이중 차감이 발생할 수 있는 구조였습니다.**\n잔액 100크레딧 상태에서 50크레딧 결제가 동시에 두 건 들어오면, 둘 다 '100 읽음 → 50 차감 → 50 저장'을 실행해 잔액이 음수가 될 수 있습니다. 또한 네트워크 불안정으로 클라이언트가 같은 결제를 재시도하면 이중 차감이 발생할 위험도 있었습니다. 테스트 결제 환경이지만 실서비스와 동일한 수준의 정합성을 목표로 설계했습니다.",
          approach:
            "**비관적 락(`SELECT FOR UPDATE`)으로 동시 접근을 직렬화하고, 멱등키로 중복 결제를 방어했습니다.**\n`SELECT FOR UPDATE`로 잔액 행을 잠가서 같은 행에 대한 동시 접근을 순차 처리되도록 했습니다. 행 단위 잠금만으로 충분하기 때문에 낙관적 락(@Version)은 사용하지 않았고, 엔티티 변경은 `@Transactional` 커밋 시 JPA Dirty Checking에 맡겼습니다. 중복 결제는 멱등키에 DB UNIQUE 제약을 걸어 같은 요청이 두 번 처리되지 않도록 방어했습니다.\n- **Testcontainers**로 실제 PostgreSQL을 띄워 검증 (Mock DB에서는 락 동작 신뢰 불가)\n- 100 스레드 동시 차감 시나리오를 10회 반복 실행",
          result:
            "**100개 스레드 동시 차감에서 10회 반복 모두 잔액 정합성 100%를 확인했습니다.**\n동일 멱등키로 들어오는 중복 요청은 DB 트랜잭션 시작 전에 즉시 차단됩니다. 이 테스트 코드가 CI에 포함되어 결제 코드 변경 시 회귀를 자동으로 감지합니다.",
          retrospective:
            "처음에는 비관적 락과 낙관적 락(@Version)을 함께 사용했는데, 비관적 락이 행 단위 배타적 접근을 이미 보장하므로 @Version은 충돌을 감지할 일이 없는 죽은 코드였습니다. 리뷰를 통해 이를 인지하고 @Version을 제거했으며, JPA Dirty Checking으로 명시적 save() 호출도 제거했습니다. 서비스가 멀티 인스턴스로 Scale-out 되면 단일 DB 비관적 락으로는 한계가 생기는 문제도 있습니다. 이때는 Redis 기반 분산 락으로 전환하거나 결제를 별도 서비스로 분리하는 방향을 검토해야 합니다.",
          details: [
            "**Dirty Checking**: 비관적 락 안에서 엔티티 변경 → 커밋 시 자동 UPDATE, 명시적 save() 불필요",
            "**Testcontainers**: 실제 PostgreSQL + 100 스레드 동시 요청으로 정합성 검증",
          ],
          codeSnippet: `// CreditService.java — 비관적 락 + Dirty Checking
@Transactional
public CreditResponse useCredit(UUID userId, CreditUseRequest request) {

    // ① SELECT FOR UPDATE → 다른 TX가 같은 행을 읽지도 쓰지도 못하게 잠금
    Credit credit = creditRepository.findByUserIdWithLock(userId);  // ← 비관적 락

    // ② 엔티티 상태 변경만 하면 커밋 시 자동 UPDATE (Dirty Checking)
    credit.use(request.amount());  // ← balance -= amount, save() 불필요
}

// CreditRepository.java
@Lock(LockModeType.PESSIMISTIC_WRITE)  // ← SELECT c FROM Credit c ... FOR UPDATE
@Query("SELECT c FROM Credit c WHERE c.userId = :userId")
Optional<Credit> findByUserIdWithLock(UUID userId);`,
          impact: "100 스레드 동시 / 잔액 정합성 100%",
        },
        {
          id: "ai-workflow",
          title: "AI 컨텍스트 오염 → 계층형 문서 + 멀티 에이전트 파이프라인",
          subtitle:
            "토큰 효율 2배 이상 향상, 교대 개발 시 문서-코드 불일치 해소",
          problem:
            "**AI가 폐기된 API를 참조해 존재하지 않는 코드를 생성하는 일이 반복됐습니다.**\nClaude Code의 Skills·Custom Commands로 반복 작업을 자동화하고 있었지만, CLAUDE.md가 1,000줄을 넘어가면서 기본 기능만으로는 해결할 수 없는 문제가 드러났습니다.\n- 1,000줄 문서를 매번 전부 로딩 → 토큰의 절반 이상이 규칙 읽기에 소모\n- 새 규칙과 폐기된 규칙이 뒤섞여 AI가 outdated 정보를 참조\n- 팀원 교대 시 문서 갱신 누락 → 다음 사람의 AI가 틀린 코드 생성\n- 간단한 작업에도 7단계 PRD를 거치는 프로세스 과잉",
          approach:
            "**1,000줄 문서를 3-Layer로 분리하고, 작업 규모에 따라 필요한 문서만 로딩하는 구조로 변경했습니다.**\n- **Core** (~150줄, 항상 로딩): 핵심 규칙·아키텍처 원칙만\n- **Appendix** (작업별 선택): tech-stack, design-system, api-reference 등\n- **Spec** (L 작업만): API_SPEC, DATA_MODEL 전체 명세\n\nSupervisor 에이전트가 요청을 S/M/L로 분류해 문서 참조량과 프로세스를 결정하고, 역할별 전문 에이전트가 순차적으로 작업합니다.\n- **Architect** → 구조·로직 구현 / **Stylist** → 디자인 시스템 적용\n- **Auditor** → 품질 검증 / **Librarian** → 코드 변경 시 문서 자동 동기화",
          result:
            "**3-Layer 모델 전환으로 토큰 소모를 극적으로 줄여 AI 가용 시간을 2배 이상 연장했습니다.** 무엇보다 outdated 문서 참조로 인한 할루시네이션(잘못된 코드 생성)을 없앴고, 단순 작업(S) 프로세스를 7단계에서 2단계로 단축했습니다. 또한 교대 개발 시 맥락 단절을 막기 위해 Librarian 에이전트 기반의 자동 문서 동기화 파이프라인을 구축, 팀 전체의 생산성(Productivity)을 크게 높였습니다.",
          retrospective:
            "Stylist가 로직까지 건드리는 월권이 초기에 잦았는데, 프롬프트에 명시적 금지 조건을 추가한 뒤 안정됐습니다. T-Shirt Sizing의 S/M/L 기준이 주관적이라 팀원 간 분류가 달랐던 점은 가이드라인 문서화로 보완할 수 있었을 것입니다.",
          details: [
            "**3-Layer 설계 근거**: 1,000줄 전체 로딩 → 150줄 Core + 필요한 Appendix만 선택 로딩으로 토큰 효율 2배 이상",
            "**T-Shirt Sizing**: S(간단한 수정, Core만) / M(신규 API, Core+Appendix) / L(아키텍처 변경, 전체) — 규모별 프로세스 차등 적용",
            "**문서 자동 동기화**: Librarian 에이전트가 코드 변경 감지 → 관련 Appendix·Spec 자동 갱신",
          ],
          diagram: {
            type: "mermaid" as const,
            content: `flowchart TD
  REQ["작업 요청"] --> SUP{"Supervisor\n(S/M/L 분류)"}
  SUP -- "S: Core만" --> ARC["Architect\n구조·로직"]
  SUP -- "M: Core+Appendix" --> ARC
  SUP -- "L: 전체" --> ARC
  ARC --> STY["Stylist\n디자인 적용"]
  STY --> AUD["Auditor\n품질 검증"]
  AUD --> LIB["Librarian\n문서 동기화"]
  LIB --> DONE["완료"]

  style SUP fill:#f59e0b,stroke:#d97706,color:#fff
  style ARC fill:#3b82f6,stroke:#2563eb,color:#fff
  style STY fill:#8b5cf6,stroke:#7c3aed,color:#fff
  style AUD fill:#ef4444,stroke:#dc2626,color:#fff
  style LIB fill:#10b981,stroke:#059669,color:#fff`,
            caption:
              "역할별 멀티 에이전트 파이프라인 — 각 에이전트가 한 가지 역할에만 집중",
          },
          impact: "토큰 효율 2배+ / 교대 개발 맥락 무결성",
        },
      ],
      frontend: [
        {
          id: "canvas-migration",
          title: "인물 관계도 시각화 성능 최적화 (SVG → Canvas)",
          subtitle: "DOM 이벤트 오버헤드 제거로 600+ 노드 환경에서 60fps 방어",
          problem:
            "**개별 노드와 엣지에 클릭 이벤트를 달기 위해 SVG DOM 요소를 사용하다 보니, 데이터 수에 비례해 렌더링 부하가 커지는 문제가 있었습니다.**\n초기에는 직관적인 이벤트 처리를 위해 각 요소를 `<svg><g>` 형태로 그렸습니다. 하지만 600명이 넘는 인물과 복잡한 관계선이 모이자 수천 개의 DOM 트리가 생성되었고, 이로 인해 마우스를 가볍게 움직이기만 해도 브라우저의 Layout/Paint 과정에 병목이 발생해 프레임이 떨어졌습니다.",
          approach:
            "**DOM 조작을 최소화할 수 있는 단일 `<canvas>` 픽셀 렌더링으로 전환하고, 이벤트 처리를 중앙화했습니다.**\nReact DOM 기반 렌더링을 걷어내고 `react-force-graph-2d`를 통해 Canvas Context 위에 노드를 그렸습니다. 커스텀 `nodeCanvasObject`로 노드 외형을 직접 렌더링하고, `nodePointerAreaPaint`로 클릭 영역을 확장하여 라이브러리의 이벤트 위임(Event Delegation) 구조 위에서 클릭/호버 인터랙션을 처리했습니다.",
          result:
            "**수천 개의 DOM 노드 유지 비용과 이벤트 리스너 오버헤드를 덜어내어, 600명 이상의 인물 관계망에서도 60fps를 안정적으로 방어할 수 있었습니다.**\n메모리 사용량이 크게 줄고 줌/팬 상호작용이 한층 부드러워졌습니다.",
          retrospective:
            "DOM 요소 각각에 이벤트 리스너를 붙이면 개발하기는 수월하지만, 데이터가 커질 때 렌더링 엔진에 적지 않은 부담을 준다는 점을 체감했습니다. Canvas API로 전환하면서 노드 렌더링과 클릭 영역을 직접 정의해야 하는 복잡함이 생겼으나, 결과적으로 렌더링 성능과 개발 편의성 사이의 명확한 트레이드오프를 조율하는 좋은 경험이 되었습니다.",
          details: [
            "**DOM → Canvas**: 개별 이벤트를 위해 생성한 수천 개의 SVG 태그를 단일 Canvas 요소로 교체해 Paint 오버헤드 완화",
            "**이벤트 위임**: 개별 리스너 부착 대신, react-force-graph-2d의 nodePointerAreaPaint로 클릭 영역을 커스텀 정의하고 라이브러리 이벤트 콜백으로 상호작용 처리",
          ],
          impact: "빈번한 Layout/Paint 방지 / 대규모 스케일에서 60fps 유지",
        },
        {
          id: "bundle-optimization",
          title: "Vite 로드 전략 개편 및 번들 분할",
          subtitle: "초기 다운로드 용량 gzip 기준 60% 절감",
          problem:
            "**html2pdf 등 무거운 외부 라이브러리로 인해 초기 진입 속도가 저하되는 문제가 있었습니다.**\n사용자가 처음 접속하는 서재(랜딩) 페이지에서 불필요하게 3.8MB의 전체 번들을 내려받고 있었습니다. 특히 특정 Export 페이지에서만 쓰이는 라이브러리(738KB)까지 초기 로드에 포함되어 로딩 병목의 원인이 되었습니다.",
          approach:
            "**Vite Bundle Analyzer로 로드 패턴을 분석하고, manualChunks 11개 + 페이지별 React.lazy 코드 분할로 번들을 세분화했습니다.**\n랜딩 페이지에서 사용하지 않는 `vendor-graph` (62KB)와 html2pdf(730KB)를 동적 임포트(Lazy Load)로 분리했습니다. 또한 통합되어 있던 거대한 `vendor-editor`를 변동이 적은 코어 로직과 수정이 잦은 확장 기능으로 세분화하여, 실제 브라우저가 필요한 자원만 선별적으로 다운로드하도록 전략을 개편했습니다.",
          result:
            "**초기 내려받는 JS 크기를 gzip 기준 450KB에서 187KB(최대 60% ↓)로 줄였습니다.**\n특히 코드를 배포할 때마다 전체 벤더를 다시 다운로드해야 했던 기존과 달리, 변경된 작은 청크(예: 확장 기능 33KB)만 새로 다운로드하도록 구조를 개선하여 재방문 사용자의 캐시 무효화 범위를 축소했습니다.",
          retrospective:
            "'일단 로딩하고 본다' 방식에서 '필요할 때만 로딩한다'로 프론트엔드 자원 관리 관점을 바꾼 계기였습니다. 단순히 번들을 쪼개는 것뿐 아니라, 모듈 분리로 재방문 사용자의 브라우저 캐시 효율성(Network Cost 절약)까지 개선할 수 있었던 점이 흥미로웠습니다.",
          details: [
            "**동적 임포트(Lazy Load)**: Export(730KB) 및 Graph 기능은 해당 라우트 진입 시 지연 로딩",
            "**브라우저 캐시 최적화**: 잦은 배포 시에도 캐시를 유지하기 위해 Editor Core와 Extensions 분리 (기존 374KB 무효화 → 33KB 무효화로 개선)",
          ],
          impact:
            "초기 용량 gzip 기준 60% 절감 / 배포 시 캐시 무효화 범위 축소",
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
        description: "동시 결제 100건 잔액 정합성 100%, Testcontainers 검증",
      },
      {
        metric: "420ms → 64ms",
        label: "인물 관계도",
        description: "SVG → Canvas, 650명 환경 실시간 인터랙션",
      },
      {
        metric: "1,000줄 → 150줄",
        label: "AI 컨텍스트 최적화",
        description:
          "3-Layer 문서 + 멀티 에이전트 파이프라인, 토큰 효율 2배 이상",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: [
          "React 19",
          "TypeScript",
          "Vite",
          "react-force-graph-2d",
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
        items: ["JUnit 5", "Testcontainers"],
      },
      {
        category: "Tools",
        items: ["Git", "GitHub Actions", "Toss Payments MCP"],
      },
    ],
  },

  aidiary: {
    id: "aidiary",
    tagline:
      "산모가 일기를 쓰면 AI가 감정을 분석해 피드백을 제공하는 서비스입니다. 부모 사진으로 아기 캐릭터를 생성하는 기능도 함께 제공합니다.",
    architectureImage: "/images/aidiary-arch.png",
    overview:
      "캡스톤 디자인 프로젝트(2인 팀)로 시작해 크래프톤 정글 수료 후 개인적으로 아키텍처 개선을 이어갔습니다. 백엔드 전체(인증·일기 CRUD·인프라)와 프론트엔드를 담당했습니다. 우선순위를 고려하여 트래픽이 검증되지 않은 초기 단계의 복잡도는 낮추되, 핵심 비즈니스 로직(AI 추론 등)은 언제든 별도 컨테이너로 뗄 수 있도록 논리적으로 분리(Loosely Coupled)한 '하이브리드 아키텍처' 설계가 가장 큰 특징입니다.",

    sections: {
      backend: [
        {
          id: "rabbitmq-async",
          title: "AI 이미지 합성 동기 블로킹 → RabbitMQ 비동기 전환",
          subtitle: "WAS 처리량 1.16 → 1,949 TPS, 응답 30s → 4.9ms",
          problem:
            "**ML 이미지 합성(~30초)이 Tomcat 스레드를 직접 점유해, 동시 사용자 10~20명에서 서비스 전체가 마비되는 Cascade Failure가 발생했습니다.**\nFlask ML 추론을 동기 호출하는 구조에서, 스레드 풀이 30초씩 점유돼 일기 작성·건강 기록 등 무관한 API까지 전부 무응답.\n- k6 실측 최대 처리량: **1.16 TPS**",
          approach:
            "**RabbitMQ로 WAS와 AI 처리를 분리하고, 3중 멱등성 가드로 중복 처리를 방지했습니다.**\n먼저 `@Async` + `ConcurrentHashMap`을 시도했지만 Scale-out 불일치와 메모리 누수(GC 후 +28MB 잔류) 문제가 드러나 RabbitMQ로 전환.\n- Spring Boot: 큐 발행 → 202 Accepted (4.9ms)\n- Python Worker: `prefetch_count=1` + 수동 ACK → Webhook 결과 전달\n- DLQ로 Worker 장애 시 메시지 보존",
          result:
            "**WAS 처리량 1.16 → 1,949 TPS, 응답 레이턴시 30,000ms → 4.9ms.**\n500 VU 부하에서 p95 318ms, 에러율 0%. 총 175,463건 처리. AI 처리 지연과 무관하게 WAS 가용성 유지.",
          retrospective:
            "Webhook 방식을 채택하다 보니 클라이언트가 주기적으로 상태를 폴링해야 합니다. UX 관점에서는 '생성 요청 → 기다림 → 완료 알림'이 깔끔하지 않고, 폴링 요청도 불필요하게 생깁니다. SSE(Server-Sent Events)나 WebSocket으로 서버에서 직접 완료 이벤트를 푸시하는 방식이 더 나았을 것 같습니다. 또 Python Worker 프로세스에 대한 헬스 체크나 모니터링이 없어서, Worker가 죽어도 바로 알 수 없는 약점이 있습니다. Prometheus + Grafana 같은 모니터링 스택을 붙이면 이 부분을 보완할 수 있습니다.",
          details: [
            "**논리적 분리 (Loosely Coupled)**: AI 서비스 호출 시 구체 클래스가 아닌 인터페이스에 의존하고 Entity 대신 DTO만 던지도록 설계. 트랜잭션 경계를 끊어내어 훗날 완전한 MSA 전환 시나리오 대비",
            "**장애 격리와 고가용성**: 무거운 연산을 격리하여 Python Flask 다운 시에도 회원 자격 및 일기 저장 (Core 생태계) 100% 정상 작동 확보",
            "**DLQ 및 3중 멱등성 가드**: Worker 장애 시 메시지 유실 방지 및 at-least-once 배달 대응 (Worker → Webhook → DB)",
          ],
          diagram: {
            type: "mermaid",
            content: `sequenceDiagram
  participant C as Client
  participant W as WAS (Spring Boot)
  participant Q as RabbitMQ
  participant P as Python Worker
  C->>+W: POST /api/images/analyze
  W->>Q: 작업 메시지 발행
  W-->>-C: 202 Accepted (4.9ms)
  Q->>+P: 메시지 소비 (prefetch=1)
  Note over P: MediaPipe 특징 추출<br/>AI 이미지 생성 (~30s)
  P->>P: basic_ack()
  P->>-W: POST /api/images/webhook (완료 콜백)
  W->>C: 폴링으로 완료 알림`,
            caption: "RabbitMQ 비동기 처리 흐름 — WAS와 AI 처리 분리",
          },
          impact: "WAS 수용 처리량 1.16 → 1,949 TPS (큐 발행 기준)",
        },

        {
          id: "redis-cache",
          title: "오늘의 질문 — 매 요청 Gemini API 호출 → Redis 날짜 기반 캐싱",
          subtitle: "응답 487ms → 3ms, Gemini 호출 일 1회 고정",
          problem:
            "**'오늘의 질문'이 요청마다 Gemini API를 호출해 매번 다른 질문을 생성하는 기능 결함이 있었고, 응답도 avg 487ms로 느렸습니다.**\n기획 의도는 하루에 하나의 질문을 모든 산모가 공유하는 것이었는데, 구현을 확인해보니 요청마다 Flask → Gemini API를 동기 호출하고 있었습니다.\n- 같은 날인데 요청마다 다른 질문 생성 → '오늘의 질문' 기능 의미 자체가 무너짐\n- API 비용이 요청 수에 비례해 선형 증가 (사용자 100명 = Gemini 100번 호출)",
          approach:
            "**날짜 자체를 Redis 키로, 자정까지 남은 시간을 TTL로 설정해 하루 1회만 Gemini API를 호출하도록 했습니다.**\n`daily_question:{yyyyMMdd}` 형태로 키를 설계하면 날짜가 바뀌는 순간 자동으로 만료되어, 별도 스케줄러 없이 다음 날 첫 요청이 새 질문을 생성합니다.\n- HIT 시 Redis에서 ~1ms 즉시 반환, AI API 호출 없음\n- MISS(하루 첫 요청)에만 Flask → Gemini 호출 (~500ms, 하루 1번만)\n- 캐시 무효화 전략이 필요 없음 — 날짜 변경 자체가 무효화",
          result:
            "**응답 487ms → 3ms, Gemini API 호출이 요청 수 비례(N회) → 일 1회로 고정됐습니다.**\n모든 산모가 같은 날 동일한 질문을 받아 기능 일관성이 확보됐고, 기능 결함(요청마다 다른 질문)도 캐싱으로 동시에 해결됐습니다.",
          retrospective:
            "자정에 키가 만료되면서 첫 번째 요청이 Gemini API를 호출하게 됩니다. 이 시점에 동시 요청이 있으면 Cache Thundering Herd 문제가 발생할 수 있습니다. 자정 직전에 다음 날 질문을 미리 캐싱하는 스케줄러를 붙였으면 더 안전했을 것입니다. 또 Redis가 다운될 때를 대비한 fallback 전략이 없어서, Gemini API를 직접 호출하는 graceful degradation을 추가하면 장애 전파를 방지할 수 있습니다.",
          details: [
            "**기능 결함 발견**: 같은 날인데 요청마다 다른 질문 생성 → 캐싱이 기능 결함과 성능을 동시에 해결",
            "**키 설계**: `daily_question:{yyyyMMdd}`, TTL = 자정까지 남은 초 — 날짜 변경 자체가 무효화, 스케줄러 불필요",
            "**Gemini 호출 절감**: 요청 수 비례(N회) → 일 1회 고정, API 비용 선형 증가 구조 제거",
          ],
          impact: "487ms → 3ms / Gemini 일 1회",
        },
        {
          id: "multi-layer-cache",
          title: "주차별 맞춤 정보 — 산모 상태 기반 개인화 응답 + 다층 캐시",
          subtitle:
            "감정·건강 데이터를 반영한 맞춤 응답, Caffeine + Redis + DB 3계층 캐시",
          problem:
            "**임신 주차 정보가 모든 산모에게 동일한 응답을 반환해, 개인화된 서비스를 제공하지 못하고 있었습니다.**\n기존 구현은 주차 번호만으로 Gemini를 호출해 42주 고정 콘텐츠를 생성하는 구조였습니다. 같은 20주차라도 최근 감정이 불안한 산모와 안정적인 산모가 동일한 정보를 받고 있었고, 체중·혈압 등 건강 데이터도 반영되지 않았습니다.",
          approach:
            "**산모의 일기 감정 분석 이력과 건강 기록을 Gemini 프롬프트에 주입해 개인화하고, 사용자×주차×컨텍스트 조합의 다양성에 대응하는 3계층 캐시를 설계했습니다.**\n`UserContextService`가 최근 7일 일기 감정 빈도와 최신 건강 기록을 수집해 요약 텍스트를 생성합니다. 이 컨텍스트를 SHA-256으로 해싱해 캐시 키(`userId:contextHash`)로 사용합니다. 동일한 컨텍스트(감정·건강 상태 변화 없음)에는 캐시가 HIT되고, 일기를 쓰거나 건강 기록이 바뀌면 해시가 달라져 자동으로 새 Gemini 호출이 발생합니다.\n- **L1 Caffeine**: 200 엔트리, 2분 TTL — 동일 사용자 반복 조회 시 네트워크 홉 없이 응답\n- **L2 Redis**: 24h + Jitter TTL — 서버 간 공유, 캐시 스탬피드 방지\n- **L3 DB**: `PersonalizedWeekContent` 엔티티로 영속화 — 서버 재시작·Redis 장애 시에도 유실 없음\n- 컨텍스트 미입력 사용자는 기존 42주 공통 캐시로 Fallback",
          result:
            "**같은 주차라도 산모의 감정·건강 상태에 따라 다른 맞춤 응답을 제공하며, 3계층 캐시로 반복 요청 시 Gemini API 비용을 절감합니다.**\n개인화로 사용자×주차×컨텍스트 조합이 다양해져 캐시가 실질적으로 필요한 구조가 됐습니다. DB 영속화 덕에 Redis 장애나 서버 재시작에도 기존 응답을 즉시 복원할 수 있습니다.",
          retrospective:
            "컨텍스트 해시가 감정·건강 데이터의 정확한 값에 의존하기 때문에, 체중이 0.1kg만 변해도 새 캐시 엔트리가 생깁니다. 값을 구간(예: 60~62kg)으로 양자화하면 캐시 히트율을 높일 수 있었을 것입니다. 또한 현재는 L3 DB 조회가 contextHash 기반 단건 조회라 인덱스만으로 충분하지만, 사용자 수가 크게 늘면 오래된 엔트리를 주기적으로 정리하는 배치가 필요합니다.",
          details: [
            "**캐시 키 설계**: SHA-256(userId + week + emotions + healthData) → 감정·건강 변화 시 해시 자동 변경으로 무효화",
            "**Fallback 전략**: 컨텍스트 미입력 → 42주 공통 캐시 / Redis 장애 → DB → Gemini 직접 호출 (graceful degradation)",
          ],
          codeSnippet: `// PregnancyWeekCacheService.java — L1 → L2 → L3 → Gemini 순차 조회
String cacheKey = ctx.userId() + ":" + ctx.contextHash();  // ← 감정·건강 변화 시 해시 변경

// L1: Caffeine (JVM 내 캐시, 네트워크 홉 없음)
PregnancyWeekDTO dto = localCache.getIfPresent(cacheKey);  // ← L1
if (dto != null) return dto;

// L2: Redis (서버 간 공유, JSON 역직렬화 필요)
String json = redisTemplate.opsForValue().get(redisKey);   // ← L2
if (json != null) {
    dto = objectMapper.readValue(json, PregnancyWeekDTO.class);
    localCache.put(cacheKey, dto);   // L1 승격
    return dto;
}

// L3: DB → L1+L2 승격 / MISS → Gemini 호출 → 전 계층 저장
// (이하 동일 패턴: 역직렬화 → populateCache → return)`,
          impact: "개인화 응답 + Gemini API 호출 최소화",
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
            "**Web Worker 2개로 사진을 병렬 압축하여 메인 스레드 블로킹을 제거했습니다.**\nOffscreenCanvas + Worker 조합도 검토했지만, 이미지 리사이즈만 필요한 상황에서 `createImageBitmap` → Canvas drawImage 파이프라인이 더 단순했기 때문에 기각했습니다. Worker A(아빠 사진)와 Worker B(엄마 사진)를 동시에 돌려 병렬 압축하고, `postMessage`로 완료된 Blob을 메인 스레드로 전달합니다. `Promise.all`로 두 Worker 완료를 기다렸다가 AI 서버로 전송합니다.",
          result:
            "**UI Freezing이 해소되고, 로딩 애니메이션이 정상 동작합니다.**\n사진 처리 중에도 다른 UI 조작이 가능하고, 두 사진을 병렬 압축하기 때문에 순차 처리 대비 시간도 단축됐습니다. 모바일에서도 매끄럽게 동작합니다.",
          retrospective:
            "Worker 2개를 항상 생성하는 방식이라 사진이 1장만 업로드될 경우 Worker 하나가 낭비됩니다. 업로드 파일 수에 따라 Worker를 동적으로 생성하거나, Worker Pool을 만들어 재사용하는 게 더 효율적입니다. 또 Worker와 메인 스레드 간 이미지 데이터를 복사하는 과정에서 메모리 사용량이 일시적으로 두 배가 됩니다. `Transferable Objects`를 사용해 복사 대신 소유권을 이전하면 이 오버헤드를 없앨 수 있는데, 당시에는 이 API를 몰라서 적용하지 못했습니다.",
          details: [
            "**OffscreenCanvas 기각**: 리사이즈만 필요한 상황에서 과잉 — createImageBitmap → Canvas drawImage로 충분",
            "**Transferable Objects**: postMessage 시 메모리 복사 대신 소유권 이전으로 오버헤드 제거 가능 (미적용, 개선 여지)",
          ],
          impact: "UI Freezing 2초 → 0 / 병렬 압축으로 처리 시간 단축",
        },
      ],
    },

    achievements: [
      {
        metric: "1.16 → 1,949 TPS",
        label: "WAS 수용 처리량",
        description:
          "RabbitMQ 비동기 전환 (큐 발행 기준), 500 VU / p95 318ms / 에러율 0%",
      },
      {
        metric: "487ms → 3ms",
        label: "오늘의 질문 API",
        description: "Redis 날짜 기반 캐싱, Gemini 호출 일 1회 고정",
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
        items: ["Docker Compose", "AWS EC2", "S3", "CloudFront"],
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
