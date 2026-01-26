---
date: 2025-11-14
tags: [CS]
---


# ✔ Pintos userprog: ELF 필수 개념 (최종 정리)

---

# 1. ELF는 “실행 파일의 메모리 배치 정보”

Pintos loader가 ELF에서 필요로 하는 정보는 단 두 가지뿐이다:

1. **이 파일이 ELF인지 확인**
    
2. **코드·데이터를 메모리에 어떻게 배치할지** (Program Header Table)
    

이걸 기반으로 커널이 유저 프로세스 주소 공간을 구성한다.

---

# 2. ELF Header에서 읽는 것

- **magic number**: ELF인지 검사
    
- **64bit 여부**
    
- **entry point(e_entry)**: 유저 프로그램 시작 RIP
    
- **PHDR offset(e_phoff)**
    
- **PHDR 개수(e_phnum)**
    

이 네 가지가 전부다.

---

# 3. Program Header Table(PHDR)에서 읽는 것

Pintos는 **PT_LOAD segment만** 처리한다.

각 loadable segment는 OS에게 다음을 지시한다:

- **p_vaddr**: 이 세그먼트를 매핑할 가상 주소
    
- **p_offset**: ELF 파일 내부에서 이 세그먼트가 시작하는 위치
    
- **p_filesz**: 파일에서 읽어야 하는 바이트
    
- **p_memsz**: 메모리에서 필요한 전체 크기
    
- **p_flags**: R/W/X 권한
    

즉:

> “이 부분을 이 주소에, 이 크기만큼 로드해 주세요.”

---

# 4. Pintos loader(load_segment)가 해야 할 실제 작업

각 PT_LOAD segment에 대해:

### 1) 페이지 단위로 메모리 매핑

- p_vaddr ~ p_vaddr + p_memsz
    
- user page(U=1)
    
- writable bit(p_flags & PF_W) 반영
    

### 2) 파일에서 p_filesz 만큼 읽어 채움

- file_read_at()
    

### 3) 남는 영역(p_memsz - p_filesz)은 0으로 채움 (BSS)

이 세 가지가 ELF 로딩의 전부다.

---

# 5. entry point 설정

ELF Header의 e_entry 값을:

```
intr_frame.rip = e_entry;
```

→ user mode로 점프할 때 CPU가 이 주소에서 실행 시작.

---

# 6. 스택은 ELF와 무관, Pintos가 직접 구성

ELF는 스택 구조를 정의하지 않는다.

Pintos는 별도로 다음 작업을 수행한다:

- 스택 페이지 생성
    
- 문자열 push
    
- argv[] 배열 push
    
- argv 포인터 push
    
- argc push
    
- fake return address push
    
- RSP 16-byte alignment 유지
    

즉:

> ELF = 코드/데이터 로딩  
> 스택 = OS가 직접 만드는 실행 준비 공간

둘은 독립적이다.

---

# 7. 최종 실행 흐름 요약 (필수 단계만)

```
1. ELF 파일 열기
2. ELF Header 검사
3. Program Header Table 읽기
4. PT_LOAD segment 반복 처리
5. 유저 스택 구성(argv/argc)
6. rip = e_entry
7. intr_exit() → 유저 모드 진입
```

이 7단계가 Pintos userprog에서 ELF가 수행하는 모든 역할이다.

---

# ✔ 한 줄 요약

**ELF는 “로드할 메모리 구간과 entry point를 알려주는 파일 포맷”이고,  
Pintos는 PT_LOAD segment만 읽어서 메모리에 배치한 뒤  
스택은 따로 구성해서 main(argc, argv)을 실행시킨다.**