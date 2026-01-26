---
date: 2025-11-13
tags: [CS]
---

# . `hlt` — Halt CPU

## 목적

CPU를 **대기 상태**에 넣어, 인터럽트가 올 때까지 실행을 중단한다.

## 동작

- CPU는 _halt state_에 진입
    
- 다음 조건 중 하나 발생 시 자동 wake-up:
    
    - 마스크되지 않은(interrupt enabled) **외부 인터럽트**
        
    - **NMI**
        
    - **RESET**
        

## 권한

- Ring 0에서만 실행 가능
    
- 유저 모드에서 실행 → #GP fault
    

## 커널에서의 사용

- idle thread에서 CPU 낭비 방지
    
- Pintos에서도 idle thread 루프에서 `hlt` 호출  
    (단, Pintos는 외부 인터럽트 활성 상태 유지)
    
`EFLAGS.IF == 1` 상태에서만 `hlt`는 외부 인터럽트에 의해 wake-up된다.

- IF=1 : 외부 인터럽트 허용 상태 → 정상적인 wake-up
    
- IF=0 : 외부 인터럽트 마스킹 → CPU는 **인터럽트로 절대 깨어날 수 없음**  
    → 사실상 시스템 정지(Deadlock)