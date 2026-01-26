---
date: 2025-11-13
tags: [CS]
---

- 유저 syscall 호출 전
    
    - 유저 stub: `mov $SYS_xxx, %rax`
        
    - → `RAX = syscall 번호`
        
- `syscall` 실행
    
    - CPU는 RAX를 건드리지 않고 커널 entry로 점프
        
    - → 커널에서도 여전히 `RAX = syscall 번호`
        
- syscall entry 어셈
    
    - `push %rax` 등으로 intr_frame에 저장
        
    - → `f->rax = syscall 번호`
        
- C 핸들러
    
    - `sysno = f->rax`
        
    - 작업 수행
        
    - `f->rax = 반환값`
        
- intr_exit
    
    - `pop %rax` → CPU RAX = 반환값
        
    - `iretq` → 유저로 복귀
        
- 유저 코드
    
    - `write()`의 리턴값 = RAX
        
    - C 변수에 저장됨: `ssize_t n = write(...);`