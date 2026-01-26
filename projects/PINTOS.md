# Pintos Kernel - 시스템 프로그래밍 챌린지

> KAIST Jungle OS Lab | **4인 팀** | C + x86 Assembly

하드웨어 위에서 직접 동작하는 교육용 운영체제의 핵심 모듈을 구현했습니다.

---

## 1. Priority Donation: 8-depth 중첩 락 체인 해결

### 문제 상황

높은 우선순위(H) 스레드가 낮은 우선순위(L) 스레드가 점유한 락을 기다릴 때, 중간 우선순위(M) 스레드가 L을 선점해버리면 H가 무한정 대기하는 **우선순위 역전(Priority Inversion)** 이 발생했습니다.

### 해결 과정

Priority Donation 메커니즘을 설계하고 구현했습니다.

```c
// lock_acquire 시 기부 로직
void lock_acquire(struct lock *lock) {
  struct thread *holder = lock->holder;
  struct thread *cur = thread_current();

  // 1. 락 보유자에게 내 우선순위 기부
  if (holder != NULL && holder->priority < cur->priority) {
    holder->priority = cur->priority;

    // 2. 중첩 기부: 보유자가 다른 락을 기다리면 체인 전파
    propagate_donation(holder, 8); // depth limit
  }
}
```

1. **Donation**: 락 대기 시 보유자에게 자신의 높은 우선순위를 일시적으로 기부
2. **Chain Handling**: 중첩된 락 대기 상황(Nested Donation)까지 재귀적으로 전파 (depth limit: 8)
3. **Revert**: 락 해제 시 기부받은 우선순위를 반납하고 본래 우선순위로 복귀

### 성과

| 테스트                          | 결과                         |
| :------------------------------ | :--------------------------- |
| `donate-one/multiple/multiple2` | **Pass**                     |
| `donate-nest/chain`             | **Pass** (8-depth 정상 동작) |
| `donate-lower`                  | **Pass** (정확한 원복)       |

---

## 2. Widowed Frame 디버깅: 무한 Page Fault 해결

### 문제 상황

mmap된 메모리에 접근하자 Page Fault가 무한 반복되며 프로세스가 `exit(-1)`로 강제 종료되었습니다.

- **현상**: Page Fault → 처리 완료 보고 → 다시 Page Fault → 무한 루프
- **원인**: 소프트웨어(`page->frame != NULL`)와 하드웨어(PML4) 간 상태 불일치

### 해결 과정

"고아 프레임(Widowed Frame)" - 프레임은 할당되었지만 PML4 매핑이 없는 상태를 감지하고 복구하는 로직을 추가했습니다.

```c
// Before: 프레임만 확인
if (page->frame != NULL)
    return true;  // 문제: PML4 매핑 누락 시 무한 Page Fault

// After: 하드웨어 매핑까지 검증
if (page->frame != NULL) {
    struct thread *t = thread_current();
    if (pml4_get_page(t->pml4, page->va) == NULL) {
        // 고아 프레임 감지 → 매핑 복구
        if (!pml4_set_page(t->pml4, page->va,
                          page->frame->kva, page->writable))
            return false;
    }
    return true;
}
```

### 성과

- 무한 Page Fault 현상 **완전 해결**
- `mmap-*` 관련 테스트 **전체 통과**

---

## 3. Demand Paging: 가상 공간 확장 및 지연 로딩

### 문제 상황

프로세스 실행 시 모든 세그먼트를 메모리에 올리면 물리 메모리가 금방 부족해집니다.

### 해결 과정

Page Fault가 발생했을 때만 해당 페이지를 로드하는 Demand Paging을 구현했습니다.

1. **Supplemental Page Table (SPT)**: 각 페이지의 메타데이터(디스크 위치, 쓰기 가능 여부) 관리
2. **Page Fault Handler**: 디스크에서 데이터를 읽어 물리 프레임에 매핑 후 재시작
3. **Stack Growth**: `rsp` 레지스터 값을 감시하여 스택 영역 접근 시 자동 페이지 할당

### 성과

- 한정된 물리 메모리 극복 및 가상 공간 활용 가능
- `page-*`, `swap-*` 테스트 **전체 통과**

---

## 전체 성과

| 모듈                    | 테스트                    | 결과         |
| :---------------------- | :------------------------ | :----------- |
| **Threads (P1)**        | Alarm 6개 + Priority 11개 | **Pass**     |
| **User Programs (P2)**  | 시스템 콜 76개            | **All Pass** |
| **Virtual Memory (P3)** | Page/Swap/Mmap 40개       | **All Pass** |
| **TOTAL**               |                           | **All Pass** |

---

## Tech Stack

| 영역            | 기술                                                     |
| :-------------- | :------------------------------------------------------- |
| **Language**    | C (C99), x86 Assembly                                    |
| **Environment** | Linux (Ubuntu), QEMU Emulator                            |
| **Tools**       | GDB (Kernel Debugging), Makefile                         |
| **Concepts**    | Virtual Memory, Paging, Multi-threading, Synchronization |
