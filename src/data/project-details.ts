import { ProjectDetail } from "@/types/project";

export const projectDetails: Record<string, ProjectDetail> = {
  stolink: {
    id: "stolink",
    tagline:
      "웹소설 작가를 위한 세컨드 브레인 서비스입니다. 에디터에서 집필하면 AI가 글을 분석하고, 월드 페이지에서 인물·관계·사건을 시각화합니다. 독자는 StoRead에서 관계도와 함께 작품을 열람할 수 있습니다.",
    architectureImage: "/images/stolink-arch.png",
    overview:
      "크래프톤 정글 최종 프로젝트 (5인 팀). OAuth2 인증, 토스페이먼츠 결제 연동, 문서 CRUD 등 백엔드와 Canvas 관계도, Tiptap 에디터, 폴더 트리 사이드바 등 프론트엔드를 담당했습니다. SVG → Canvas 전환으로 관계도 INP를 420ms에서 64ms로 개선하고, 외부 API 타임아웃 누락으로 인한 Cascading Failure를 쓰레드 덤프 분석으로 추적하여 해결했으며, 결제 동시성 제어는 Testcontainers로 100스레드 환경에서 정합성을 검증했습니다.",

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
          id: "cascading-failure",
          title:
            "외부 API 타임아웃 누락 → 톰캣 쓰레드풀·HikariCP 커넥션풀 연쇄 고갈",
          subtitle:
            "쓰레드 덤프 분석 → 필드 주입 빈 라이프사이클 문제 발견 → 생성자 주입 리팩토링",
          problem:
            "**프로덕션 서버가 간헐적으로 모든 API 요청에 응답하지 못하고 멈추는 장애가 발생했습니다.**\n크롬 개발자 도구에서 API 요청이 타임아웃으로 실패하는 것을 확인했으나, 서버의 CPU·메모리는 정상이었습니다. 쓰레드 덤프를 떠서 분석한 결과, 다수의 톰캣 쓰레드가 AI 이미지 서버 헬스체크용 `RestTemplate.getForObject()`에서 Socket Read(RUNNABLE) 상태로 블로킹되어 있었습니다. 이 호출이 `@TransactionalEventListener` 내부에서 `@Transactional(propagation = REQUIRES_NEW)`로 별도 트랜잭션을 할당받은 상태에서 실행되고 있어, 외부 서버 무응답 시 쓰레드가 DB 커넥션을 점유한 채 무한정 대기했습니다.\n- 대기 쓰레드가 누적되며 HikariCP 커넥션 풀 고갈\n- 후속 요청이 커넥션을 획득하지 못하고 WAITING 상태로 전이\n- 최종적으로 톰캣 메인 쓰레드 풀 전체가 마비되는 Cascading Failure",
          approach:
            "**쓰레드 덤프를 분석해 원인 추적에 들어갔습니다.**\n추적해보니 해당 RestTemplate의 Timeout을 `@Value` 필드 주입으로 설정했으나, 빈 라이프사이클상 필드 주입은 생성자 이후에 이루어지므로 RestTemplate 생성 시점에는 값이 0인 채로 남아 기본값(무한 대기)으로 동작하고 있었습니다.\n- 필드 주입이 빈 라이프사이클 문제의 근본 원인임을 파악하고, 해당 서비스의 설정 주입 방식을 생성자 주입으로 리팩토링\n- 빈 생성 시점에 Timeout이 확실히 반영되도록 수정\n- 외부 서버 미응답 시 5초 후 `ImageServerNotHealthyException`을 던지고 즉각 DB 커넥션과 쓰레드를 반환",
          result:
            "**이전에는 대기 요청 20건만으로 서버 전체가 마비되었으나, 수정 후에는 외부 서버가 완전히 다운된 상황에서도 코어 서비스 응답이 정상 유지되었습니다.** 잦았던 수동 컨테이너 재시작 운영 이슈가 해소되었고, 외부 시스템 장애가 내부로 전파되는 Cascading Failure를 구조적으로 격리했습니다.",
          retrospective:
            "필드 주입이 빈 라이프사이클에서 어떤 시점에 동작하는지 정확히 몰랐기 때문에 발생한 장애였습니다. 생성자 주입으로 전환하면서 Spring의 DI 메커니즘을 깊이 이해하게 되었고, 이후 모든 외부 HTTP 호출에 명시적 타임아웃을 강제하는 것을 원칙으로 삼았습니다. 또한 트랜잭션 내부에서 네트워크 I/O를 수행하는 아키텍처적 결함이 근본 원인이었으며, 이 경험을 교훈 삼아 결제 PG 연동에서는 외부 호출을 트랜잭션 밖으로 분리하는 설계를 선제적으로 적용했습니다.",
          details: [
            "**근본 원인**: @Value 필드 주입이 생성자 이후에 실행되는 빈 라이프사이클 문제 → RestTemplate Timeout 미적용 → 무한 대기",
            "**연쇄 장애 흐름**: Socket Read(RUNNABLE) 블로킹 → REQUIRES_NEW로 HikariCP 커넥션 점유 → 후속 요청 WAITING 전이 → 전체 서비스 마비",
            "**설계 파급 효과**: 이 경험이 직접적 계기가 되어, 결제 PG 연동 시 TransactionTemplate으로 검증·외부 호출·DB 반영을 3단계로 분리하는 방어적 아키텍처를 적용",
          ],
          codeSnippet: `// Before — @Value 필드 주입 → 생성자 시점에 값이 0, RestTemplate 무한 대기
@Value("\${app.image-server.health-timeout-ms:5000}")
private int timeoutMs;  // ← 필드 주입은 생성자 이후에 실행됨

public ImageServerHealthChecker() {
    // timeoutMs = 0 → 기본값 무한 대기(-1)로 동작
    this.restTemplate = new RestTemplate();
}

// After — 생성자 주입으로 빈 생성 시점에 Timeout 확실히 반영
public ImageServerHealthChecker(RestTemplateBuilder builder,
        @Value("\${app.image-server.health-timeout-ms:5000}") int timeoutMs) {
    this.restTemplate = builder
            .setConnectTimeout(Duration.ofMillis(timeoutMs))  // 연결 타임아웃 5초
            .setReadTimeout(Duration.ofMillis(timeoutMs))     // 응답 타임아웃 5초
            .build();
}`,
          diagram: {
            type: "mermaid",
            content: `sequenceDiagram
  participant C as Client
  participant T as Tomcat Thread Pool
  participant H as HikariCP (max 20)
  participant HC as HealthChecker
  participant AI as AI Image Server (Down)

  rect rgb(254, 226, 226)
  Note over T,AI: Before — @Value 필드 주입 → Timeout 미적용 → Cascading Failure
  C->>+T: API 요청
  T->>+H: REQUIRES_NEW → 커넥션 획득
  H->>+HC: RestTemplate.getForObject()
  HC->>AI: GET /health (timeout = ∞)
  Note over HC,AI: ⚠️ Socket Read(RUNNABLE) 상태로 블로킹
  Note over H: ⚠️ DB 커넥션 점유 (반환 불가)
  Note over T,H: 풀 고갈 → 후속 요청 WAITING 전이 → 전 API 마비
  end

  rect rgb(220, 252, 231)
  Note over T,AI: After — 생성자 주입으로 Timeout 확실히 반영
  C->>+T: API 요청
  T->>+H: REQUIRES_NEW → 커넥션 획득
  H->>+HC: RestTemplate.getForObject()
  HC->>AI: GET /health (timeout = 5s)
  Note over HC,AI: 5초 후 SocketTimeoutException
  HC-->>-H: throw ImageServerNotHealthyException
  H-->>-T: 커넥션 즉시 반환 ✓
  T-->>-C: 에러 응답 (장애 격리 성공)
  end`,
            caption:
              "Cascading Failure 발생 메커니즘과 Fail-Fast 타임아웃 적용 후 격리",
          },
          impact: "외부 서버 장애 → 전체 서비스 마비 전파 차단",
        },
        {
          id: "connection-pool",
          title: "결제 PG 외부 API 호출에 의한 DB 커넥션 풀 고갈 방지",
          subtitle:
            "Cascading Failure 경험을 토대로 트랜잭션-외부 I/O 선제 분리",
          problem:
            "**위 Cascading Failure를 겪은 뒤, 결제 플로우에도 동일한 구조적 위험이 있음을 인지했습니다.**\n결제 승인 로직이 하나의 트랜잭션 안에서 토스페이먼츠 API를 동기 호출하고 있었습니다. HikariCP 기본 풀은 10개인데 PG 응답이 1~2초 소요되므로, 동시 결제 10건이면 일반 API(문서 조회, 에디터 저장)까지 커넥션 부족 오류가 발생할 수 있는 구조였습니다.",
          approach:
            "**네트워크 I/O와 DB 트랜잭션을 분리했습니다.**\n첫 번째 트랜잭션에서 결제 검증과 상태 전환(IN_PROGRESS)만 수행하고 즉시 커밋하여 커넥션을 반환합니다. 이후 트랜잭션 밖에서 토스페이먼츠 API를 호출하므로, PG 응답을 1~2초 기다리는 동안에도 DB 커넥션을 점유하지 않습니다. PG 승인이 완료되면 두 번째 트랜잭션에서 크레딧 차감과 결제 완료 처리만 수행합니다.\n\n트랜잭션을 분리하면 PG는 승인했는데 두 번째 트랜잭션이 실패하는 데이터 불일치가 발생할 수 있습니다. 이때 즉시 PG 취소를 호출하면 사용자 입장에서는 결제가 실패한 경험이 됩니다. 대신 토스페이먼츠가 발송하는 웹훅을 백업 경로로 활용하여, 웹훅 수신 시 누락된 내부 트랜잭션을 다시 시도하는 최종적 일관성(Eventual Consistency) 전략을 택했습니다.\n\n웹훅으로도 해결되지 않는 경우를 대비해 PaymentScheduler가 주기적으로 실패 건을 재처리합니다. 웹훅 재시도는 최대 3회(5분 × 재시도 횟수 간격), 보상 트랜잭션 재시도는 최대 5회(10분 간격)로 구성했습니다. 최대 재시도를 초과하면 REQUIRES_MANUAL 상태로 전환하여 수동 처리 대상으로 분류합니다.",
          result:
            "**PG 응답 지연이 DB 커넥션 풀에 영향을 주지 않는 구조로 전환되었습니다.**\n결제 API에 의도적으로 지연을 주입한 상태에서도 문서 조회·에디터 저장 등 일반 API가 정상 응답하는 것을 직접 확인했습니다. 장애가 결제 기능에만 격리되어, Cascading Failure에서 경험한 '하나의 외부 호출이 전체 서비스를 마비시키는' 문제를 결제 플로우에서도 구조적으로 방지했습니다.",
          retrospective:
            "'트랜잭션 안에서 외부 API 호출 금지'는 백엔드 설계의 기본 원칙인데, 초기 구현에서 놓쳤다가 코드 리뷰 과정에서 발견해 수정했습니다. 현재 구조에서도 PG사가 완전히 다운됐을 때를 대비한 회로 차단기(Circuit Breaker)가 없습니다. Resilience4j를 적용해 PG 연속 실패 시 빠른 실패(Fail Fast)와 사용자에게 명확한 안내 메시지를 주는 것이 다음 단계입니다.",
          details: [
            "**TX 분리 흐름**: TX1(검증 + IN_PROGRESS 상태 전환 → 커밋) → Non-TX(PG API 호출, 커넥션 미점유) → TX2(크레딧 차감 + 완료 처리)",
            "**최종적 일관성 전략**: TX2 실패 시 즉시 취소 대신 웹훅 재처리로 사용자 결제 완료 경험 보장 — 토스페이먼츠 웹훅 수신 시 누락된 내부 트랜잭션을 재시도",
            "**다단계 재시도**: 웹훅 재시도 최대 3회(5분 × 재시도 횟수) + 보상 트랜잭션 재시도 최대 5회(10분 간격) — 최대 초과 시 REQUIRES_MANUAL로 수동 처리 전환",
            "**PaymentCompensation 엔티티**: PENDING → RESOLVED 또는 REQUIRES_MANUAL 상태 관리로 미해결 건 추적",
            "**장애 격리 검증**: 결제 API에 의도적 지연 주입 후 일반 API(문서 조회·에디터 저장)가 정상 응답하는 것을 직접 확인",
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
            "**AI 코드 리뷰를 통해 트랜잭션 경합 시 발생하는 갱신 손실 및 이중 차감 취약점을 인지하게 되었습니다.**\n동일 계정 동시 결제 시 Race Condition으로 인해 양쪽 프로세스가 차감 전 잔액을 읽어 데이터가 덮어씌워지거나, 비정상적인 재시도로 인해 중복 결제되는 위험이 있었습니다. 이를 정확히 검증하고자 Testcontainers와 CountDownLatch를 이용해 100개의 스레드가 경합하는 테스트 환경을 구축했고, 정합성이 깨지는 현상을 재현하며 결함을 확인했습니다.",
          approach:
            "**정합성이 필수적인 결제 로직 특성을 고려해 재시도 비용이 큰 낙관적 락 대신, 비관적 락을 채택하고 멱등키를 병행했습니다.**\n- **동시성 제어**: 충돌 후의 재시도 로직보다 데이터 정합성 보장이 확실한 비관적 락(SELECT FOR UPDATE)을 적용해 트랜잭션을 직렬화했습니다. 성능 저하를 방지하기 위해 인덱스 기반의 행 단위 락으로 점유 범위를 최소화했습니다.\n- **멱등성 보장**: 이중 차감을 원천 차단하고자 멱등키를 도입하여 DB UNIQUE 제약과 토스페이먼츠 API 헤더 검증으로 내부 및 통신 구간에 걸쳐 차단했습니다.",
          result:
            "**테스트 결과, 초과 차감 없이 잔액 정합성 100% 검증을 통과했습니다.**\n동일한 멱등키로 들어온 중복 결제 요청 역시 트랜잭션 전단계에서 즉시 차단됨을 확인했습니다. 현재 이 동시성 검증 테스트 코드는 CI 파이프라인에 통합되어 로직 수정에 따른 잠재적인 회귀 오류를 지속해서 감지하고 있습니다.",
          retrospective:
            "비관적 락을 주 전략으로 선택한 이유는 결제 도메인 특성상 충돌 처리보다 트랜잭션의 엄격한 직렬화가 데이터 무결성에 더 기여하기 때문입니다. SELECT FOR UPDATE는 DB 레벨 락이므로 앱 인스턴스가 여러 개여도 안전하게 동시성을 제어합니다. 다만 동시 결제 트래픽이 극단적으로 몰릴 때는 행 잠금 대기로 인한 지연 가능성도 존재하므로, 그 단계에 다다르면 큐(RabbitMQ 등) 기반 비동기 순차 처리 체계로의 확장을 검토해야 함을 깨달았습니다.",
          details: [],
          codeSnippet: `// CreditService.java — 비관적 락으로 트랜잭션 직렬화
@Transactional
public CreditResponse useCredit(UUID userId, CreditUseRequest request) {

    // ① 인덱스 기반 행 단위 비관적 락 획득
    Credit credit = creditRepository.findByUserIdWithLock(userId);

    // ② 상태 변경 시 트랜잭션 커밋과 함께 즉시 반영 (Dirty Checking)
    credit.use(request.amount());
}

// CreditRepository.java
@Lock(LockModeType.PESSIMISTIC_WRITE)
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
            "**3-Layer 모델 전환으로 토큰 소모를 극적으로 줄여 AI 가용 시간을 2배 이상 연장했습니다.** 무엇보다 outdated 문서 참조로 인한 할루시네이션(잘못된 코드 생성)을 없앴고, 단순 작업(S) 프로세스를 7단계에서 2단계로 단축했습니다. 또한 교대 개발 시 맥락 단절을 막기 위해 Librarian 에이전트 기반의 자동 문서 동기화 파이프라인을 구축, 팀 전체의 생산성을 크게 높였습니다.",
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
            "**개별 노드와 엣지에 클릭 이벤트를 달기 위해 SVG DOM 요소를 사용하다 보니, 데이터 수에 비례해 렌더링 부하가 커지는 문제가 있었습니다.**\n초기에는 직관적인 이벤트 처리를 위해 각 요소를 `<svg><g>` 형태로 그렸습니다. 하지만 600명이 넘는 인물과 복잡한 관계선이 모이자 수천 개의 DOM 트리가 생성되었고, 이로 인해 마우스를 가볍게 움직이기만 해도 브라우저의 Style Recalculation → Layout → Paint가 연쇄적으로 발생하며 메인 스레드에 병목이 생겨 프레임이 떨어졌습니다.",
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
          impact:
            "빈번한 Style Recalculation/Layout/Paint 방지 / 대규모 스케일에서 60fps 유지",
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
    architectureDiagram: {
      type: "svg",
      content: "/images/aidiary_arch_v5.svg",
    },
    overview:
      "캡스톤 디자인 (2인 팀)으로 시작해 수료 후 개인적으로 아키텍처 개선을 이어갔습니다. 인증, 일기 CRUD, AI 연동 등 Spring Boot + Flask 이중 서버 백엔드 전체와 Docker Compose 기반 인프라를 담당했습니다. AI 합성(~30초)의 동기 블로킹 문제를 @Async 시도 → 부하 테스트에서 메모리 고갈 확인 → RabbitMQ 전환으로 단계적으로 해결하여 TPS를 1.16에서 1,949까지 개선했으며, 도메인 카테고리 해시 기반 캐시로 반복 API 호출 비용을 줄였습니다.",

    sections: {
      backend: [
        {
          id: "rabbitmq-async",
          title: "AI 이미지 합성 동기 블로킹 → RabbitMQ 비동기 전환",
          subtitle:
            "WAS 처리량 1.16 → 1,949 TPS, 동기 대기 30초 → 비동기 즉시 응답(4.9ms)",
          problem:
            "**ML 이미지 합성(~30초) 작업이 Tomcat 스레드를 직접 점유하여, 동시 사용자 10~20명 수준에서도 전체 서비스가 마비되었습니다.**\nFlask ML 추론을 동기 호출하는 구조에서, 스레드 풀이 30초씩 점유돼 일기 작성·건강 기록 등 무관한 API까지 전부 무응답.\n- k6 실측 최대 처리량: **1.16 TPS**",
          approach:
            "**@Async → 부하 테스트에서 한계 확인 → RabbitMQ로 전환했습니다.**\n우선 `@Async`로 톰캣 스레드를 즉시 반환하도록 전환하여 처리량을 개선했으나, 부하 테스트에서 요청이 몰리자 로컬 큐 포화로 메모리 고갈이 발생했습니다. AI 합성 작업의 무거운 특성상 별도 서비스 분리를 검토하는 과정에서, WAS 내부 메모리 큐에 의존하는 `@Async`는 서버 종료·재배포 시 작업이 유실되는 구조적 한계도 확인했습니다.\n이에 RabbitMQ를 도입하여 메시지 영속성을 확보하고, AI 합성 처리를 WAS와 물리적으로 분리했습니다.\n- Spring Boot: 큐 발행 → 202 Accepted (4.9ms)\n- Python Worker: `prefetch_count=1` + 수동 ACK → Webhook 결과 전달\n- DLQ로 Worker 장애 시 메시지 보존",
          result:
            "**WAS 처리량 1.16 → 1,949 TPS. 동기 대기 30초 → 비동기 전환으로 즉시 응답(4.9ms).**\n500 VU 부하에서 p95 318ms, 총 175,463건 처리. AI 서비스가 다운되더라도 로그인·일기 작성 등 주요 기능은 정상 동작하는 장애 격리 구조를 확보했습니다.",
          retrospective:
            "@Async에서 바로 RabbitMQ로 간 것이 아니라, 부하 테스트에서 실제로 메모리 고갈을 겪고, 서비스 분리를 설계하는 과정에서 작업 유실 문제를 확인한 뒤 전환했습니다. Webhook 방식을 채택하다 보니 클라이언트가 주기적으로 상태를 폴링해야 하는데, SSE나 WebSocket으로 서버에서 직접 완료 이벤트를 푸시하는 방식이 UX 측면에서 더 나았을 것입니다.",
          details: [
            "**@Async 한계**: 부하 테스트에서 로컬 큐 포화로 메모리 고갈 실측 / WAS 내부 메모리 큐 의존으로 서버 종료·재배포 시 작업 유실",
            "**장애 격리**: AI 연산을 별도 Worker로 분리하여, Flask 서버가 다운되더라도 로그인·일기 작성 등 주요 기능은 정상 동작",
            "**DLQ 및 3중 멱등성 가드**: Worker 장애 시 메시지 유실 방지(DLQ), 메시지 재전달로 인한 중복 처리 방지를 Worker → Webhook → DB 각 단계에서 적용",
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
          id: "gemini-cache",
          title:
            "Gemini API 매 요청 호출 → 컨텍스트 해시 기반 캐시로 호출 최소화",
          subtitle:
            "주차별 정보 487ms → 0.1ms — 도메인 카테고리 해시로 캐시 무효화 제어",
          problem:
            "**주차별 정보와 오늘의 질문 기능이 매 요청마다 Gemini API를 호출하고 있어, 응답 시간 평균 487ms에 API 비용이 요청 수에 비례해 선형 증가하는 구조였습니다.**\n주차별 정보는 주차 번호만으로 Gemini를 호출해 42주 고정 콘텐츠를 생성하는 구조로, 같은 20주차라도 최근 감정이 불안한 산모와 안정적인 산모가 동일한 정보를 받고 있었습니다. 오늘의 질문은 기획 의도상 하루에 하나의 질문을 모든 산모가 공유해야 하는데, 요청마다 다른 질문을 생성하는 기능 결함도 있었습니다.",
          approach:
            "**같은 주차·같은 건강 상태의 산모에게는 동일한 응답이 돌아오므로, 상태가 바뀌지 않은 요청은 캐싱할 수 있다고 판단했습니다.**\n\n산모의 최근 7일 일기 감정 빈도와 최신 건강 기록을 수집해 Gemini 프롬프트에 주입하여 개인화했습니다. 그런데 개인화로 인해 사용자×주차×감정·건강 상태 조합이 다양해졌고, 상태가 불규칙하게 바뀌므로(일기를 쓰거나 건강 기록이 바뀔 때) 단순 TTL 캐시로는 '바뀌었을 때 무효화, 안 바뀌었으면 유지'를 처리할 수 없었습니다.\n\n처음에는 원시 컨텍스트를 그대로 SHA-256으로 해싱했으나, 혈압이 1만 변해도 새 키가 생겨 캐시 히트율이 급락했습니다. 이에 감정(긍정/중립/부정)·혈압(정상/주의/위험)·태동(활발/보통/저조) 등 도메인 기준으로 카테고리화한 뒤 해싱하여, **의미 있는 상태 변화에서만 캐시가 무효화**되는 구조를 설계했습니다.\n\n**Caffeine 캐시 구성**\nCaffeine 로컬 캐시로 네트워크 홉 없이 즉시 반환합니다.\n- **Caffeine**: 200 엔트리, 2분 TTL — 동일 사용자 반복 조회 시 즉시 응답\n- 캐시 MISS 시 Gemini를 다시 호출하면 되므로 DB 영속화는 불필요\n\n**오늘의 질문 — DB 날짜 기반 저장**\n하루 1회 생성되는 공통 데이터이므로 개인화 캐시와 전략을 분리했습니다. 날짜 컬럼으로 조회하여 당일 데이터가 있으면 반환, 없으면 Gemini를 호출해 저장합니다. 하루 1회만 호출되므로 캐시보다 영속 저장이 적합했습니다.",
          result:
            "**주차별 정보 응답 487ms → 0.1ms(Caffeine HIT), 오늘의 질문은 Gemini 호출 일 1회 고정.**\nGemini 호출이 매 요청에서 컨텍스트 변경 시 또는 일 1회로 고정되어 API 비용을 대폭 절감했습니다. 주차별 정보는 산모의 감정·건강 상태에 따라 다른 맞춤 응답을 제공하게 되었고, 오늘의 질문은 모든 산모가 같은 날 동일한 질문을 받아 기능 일관성도 확보했습니다.",
          retrospective:
            "카테고리 경계값 설정이 도메인 지식에 의존합니다. 현재는 의료 기준(예: 혈압 140 이상 = 위험)을 참고했지만, 실제 산모 데이터가 축적되면 통계 기반으로 경계값을 보정해야 캐시 히트율과 응답 정확도를 동시에 높일 수 있을 것입니다.",
          details: [
            "**용도별 캐시 전략 분리**: 개인화 데이터(컨텍스트 해시 기반 Caffeine) vs 공통 데이터(날짜 기반 DB 저장) — 데이터 특성에 맞는 캐시 설계",
            "**캐시 키 설계**: 원시 값 해싱 → 히트율 급락 → 도메인 카테고리(감정 3단계·혈압 3단계·태동 3단계)로 양자화 후 SHA-256 해싱, 의미 있는 변화에서만 무효화",
            "**Fallback 전략**: 컨텍스트 미입력 사용자 → 42주 공통 캐시 / 캐시 MISS → Gemini 직접 호출",
          ],
          codeSnippet: `// PregnancyWeekCacheService.java — 도메인 카테고리 해시 기반 캐시
// 원시 값이 아닌 도메인 카테고리로 양자화 후 해싱
String category = categorize(ctx.emotions(), ctx.bloodPressure(), ctx.fetalMovement());
String cacheKey = ctx.userId() + ":" + sha256(ctx.week() + ":" + category);

// Caffeine (JVM 내 캐시, 네트워크 홉 없이 즉시 반환)
PregnancyWeekDTO dto = localCache.getIfPresent(cacheKey);  // ← ~0.1ms
if (dto != null) return dto;

// MISS → Gemini 호출 → 캐시 저장
dto = geminiClient.getPersonalizedWeekInfo(ctx);  // ← ~487ms
localCache.put(cacheKey, dto);
return dto;`,
          impact: "응답 487ms → 0.1ms / Gemini API 호출 최소화",
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
        description: "RabbitMQ 비동기 전환 (큐 발행 기준), 500 VU / p95 318ms",
      },
      {
        metric: "487ms → 0.1ms",
        label: "Gemini API 캐시 최적화",
        description:
          "도메인 카테고리 해시 기반 캐시, 용도별 전략 분리 (개인화: 컨텍스트 해시 / 공통: 날짜 기반 DB)",
      },
    ],

    techStack: [
      {
        category: "Frontend",
        items: ["React", "TypeScript", "Zustand", "Web Worker API"],
      },
      {
        category: "Backend",
        items: ["Spring Boot", "JPA", "MariaDB", "RabbitMQ", "Caffeine"],
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
