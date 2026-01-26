---
date: 2025-09-26
tags: [CS]
---

# Bomb Lab Phase 1 – 흐름 정리

## 함수 흐름

1. **입력 받기**
    
    - `read_line` 호출 → 사용자가 입력한 문자열을 버퍼에 저장.
        
2. **문자열 비교 준비**
    
    - `phase_1` 내부에서 `mov` 명령어로 **정답 문자열 주소**를 특정 레지스터(e.g., `%esi`)에 올림.
        
    - 사용자 입력 포인터는 `%edi` 같은 레지스터에 들어감.
        
3. **strcmp 호출**
    
    - `call strcmp` (혹은 `strncmp`) 실행.
        
    - strcmp는 두 문자열을 비교하고,
        
        - 0 → 같음
            
        - 0 아님 → 다름
            
4. **조건 분기**
    
    - `test %eax, %eax` → strcmp 결과 확인.
        
    - `jne <explode_bomb>` → 결과가 0이 아니면 폭탄 터짐.
        
5. **성공 시 흐름**
    
    - 문자열이 정확히 맞으면 다음 phase로 진행.
        

---

## gdb에서 확인할 흐름

```bash
gdb ./bomb
(gdb) break phase_1
(gdb) run
(gdb) disassemble
```

대략 이런 식의 어셈블리가 보임:

```asm
phase_1:
   call   read_line
   mov    $0x402400,%esi    # 정답 문자열 주소
   mov    %rax,%rdi         # 사용자 입력
   call   strcmp
   test   %eax,%eax
   jne    explode_bomb
   ret
```

---

## 배운 점

- **핵심은 strcmp 결과가 0인지 아닌지**.
    
- 결국 phase_1은 “정해진 문자열을 그대로 입력해야 한다”는 단순 로직.
    
- 하지만 gdb로 추적하면서,
    
    - 정답 문자열이 어디 저장돼 있는지,
        
    - 어떤 레지스터에 올라오는지,
        
    - 함수 호출 흐름이 어떻게 이어지는지  
        를 확인하는 게 진짜 훈련 포인트였다.
        

