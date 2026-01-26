---
date: 2025-12-09
tags: [CS]
---

# Pintos Project 3: Page Merge Tests Debugging Report

이 문서는 `page-merge-par`, `page-merge-stk`, `page-merge-mm` 테스트 실패 원인과 해결 과정을 정리한 것입니다.

## 1. 문제 개요

Pintos VM 프로젝트의 `page-merge-*` 테스트들은 멀티프로세스 환경에서 파일 시스템과 가상 메모리의 병행성 및 안정성을 검증합니다. 초기에는 모든 테스트가 실패했으며, 주요 원인은 **Race Condition(경쟁 상태)**, **Recursive Locking(재귀적 락)**, 그리고 **Stack Growth(스택 확장) 로직 누락**이었습니다.

## 2. 주요 이슈 및 해결 과정

### Issue 1: `open failed` (Race Condition)

- **증상**: 자식 프로세스가 실행 파일을 
    
    load 하거나 파일을 열 때 간헐적으로 "open failed" 에러 발생.
- **원인**:
    1. userprog/process.c의 
        
        load 함수에서 
        
        filesys_open을 호출할 때 `filesys_lock`을 획득하지 않아, 다른 프로세스의 파일 닫기(
        
        process_exit) 작업과 충돌 발생.
    2. process_exit 및 
        
        process_cleanup에서 파일을 닫을 때도 락을 걸지 않아 파일 시스템 구조체가 손상됨.
- **해결**:
    - load 함수 내 파일 오픈 구간을 `filesys_lock`으로 보호.
    - process_exit 및 
        
        process_cleanup의 파일/디렉토리 닫기 구간을 `filesys_lock`으로 보호.
    - userprog/syscall.c의 
        
        s_create, 
        
        s_remove에도 `filesys_lock` 적용.

### Issue 2: Kernel Panic failing assertion `!lock_held_by_current_thread(lock)`

- **증상**: `page-merge-mm` 테스트 중 
    
    sys_mmap 호출 시 커널 패닉 발생.
- **원인**:
    - sys_mmap 함수에서 `filesys_lock`을 획득한 상태로 
        
        do_mmap을 호출.
    - do_mmap 내부에서 `file_reopen`을 위해 다시 `filesys_lock`을 획득하려고 시도하여 **Recursive Locking(재귀적 락)** 발생 (Pintos의 락은 재귀적 획득을 지원하지 않음).
- **해결**:
    - sys_mmap에서 `file_length`를 구할 때만 락을 쓰고 해제한 뒤, 
        
        do_mmap을 호출하도록 변경. (
        
        do_mmap 내부에서 자체적으로 락 관리)

### Issue 3: `child-qsort: exit(-1)` (Missing Stack Growth Logic)

- **증상**: `page-merge-stk` 테스트에서 자식 프로세스가 비정상 종료됨.
- **원인**:
    - `child-qsort` 테스트 프로그램이 스택 공간에 큰 버퍼를 할당하고 
        
        read() 시스템 콜을 호출.
    - 이 메모리는 아직 물리 프레임에 매핑되지 않은 상태(Unmapped Stack)임.
    - syscall.c의 
        
        s_check_buffer (또는 `check_address`) 함수가 해당 주소를 "유효하지 않은 주소"로 판단하여 프로세스를 강제 종료시킴.
- **해결**:
    - s_check_buffer에 **스택 확장(Stack Growth) 감지 로직** 추가.
    - 버퍼 주소가 스택 포인터(`rsp`) 근처이고 유효한 스택 범위 내라면, 
        
        vm_alloc_page와 
        
        vm_claim_page를 호출하여 스택 페이지를 즉시 할당하도록 수정.

## 3. 결론

위의 세 가지 핵심 수정 사항을 통해 `page-merge-stk`, `page-merge-par`, `page-merge-mm` 테스트가 모두 통과되었습니다. 이는 파일 시스템 접근의 동기화, 락 관리의 정확성, 그리고 사용자 버퍼 검증 시의 유연한 스택 확장 처리가 필수적임을 보여줍니다.