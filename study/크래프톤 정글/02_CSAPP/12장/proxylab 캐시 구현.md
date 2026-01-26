---
date: 2025-11-04
tags: [CS]
---


### ⏰ 캐시 구현 4시간 계획 (19:30 ~ 23:30)

#### 1. 19:30 ~ 20:15 (45분): 캐시 자료구조 설계 및 락(Lock) 선언

- `struct CacheLine` 구조체를 정의합니다. (LRU를 위한 `prev`, `next` 포인터, `uri`, `data` 포인터, `size` 포함)
    
- 전역 변수를 선언합니다. (예: `CacheLine *head`, `CacheLine *tail`, `size_t current_cache_size`)
    
- **가장 중요한 것**: 캐시 전체를 보호할 **단 하나의 뮤텍스(One Big Lock)**를 전역으로 선언합니다.
    
    C
    
    ```
    pthread_mutex_t cache_mutex;
    ```
    
- `cache_init()` 함수에서 이 락을 초기화합니다. (`pthread_mutex_init`)
    

#### 2. 20:15 ~ 22:15 (2시간): 핵심 캐시 로직 구현 (가장 어려운 부분)

- **`cache_find(uri)`**:
    
    - `pthread_mutex_lock(&cache_mutex);`
        
    - 이중 연결 리스트를 `head`부터 순회하며 `uri`를 찾습니다.
        
    - **(LRU 핵심)**: 찾았다면, 그 노드를 리스트에서 떼어내어 **`head`로 옮깁니다.**
        
    - `pthread_mutex_unlock(&cache_mutex);`
        
    - 찾은 데이터를 반환합니다.
        
- **`cache_insert(uri, data, size)`**:
    
    - `pthread_mutex_lock(&cache_mutex);`
        
    - `while` 루프: `(current_cache_size + size) > MAX_CACHE_SIZE`일 동안, `cache_evict()` (꼬리 제거)를 계속 호출합니다.
        
    - 새 노드를 `malloc`하고 `data`를 복사한 뒤, `head`에 삽입합니다.
        
    - `current_cache_size`를 갱신합니다.
        
    - `pthread_mutex_unlock(&cache_mutex);`
        
- **`cache_evict()`**: `tail` 노드를 찾아 `free(tail->data)` 및 `free(tail)` 하고 `current_cache_size`를 갱신합니다. (이 함수는 `insert` 내부에서 이미 락이 걸린 상태로 호출됩니다.)
    

**[팁]** 이중 연결 리스트의 포인터 조작(`head`로 옮기기, `tail` 삭제)이 이 단계에서 가장 버그가 많이 나는 곳입니다. 집중하셔야 합니다.

#### 3. 22:15 ~ 23:00 (45분): `doit` 함수에 캐시 로직 통합

- `worker_routine` (혹은 `doit`) 함수의 로직을 수정합니다.
    
    1. `(캐시 로직)` `cache_find(uri)`를 먼저 호출합니다.
        
    2. **[Cache Hit]** `cache_find`가 성공하면, 찾은 데이터를 `Rio_writen`으로 브라우저에 즉시 전송하고 함수를 `return` 합니다.
        
    3. **[Cache Miss]** 실패하면, (기존 2단계 로직) `Open_clientfd`로 서버에 연결하고 응답을 받습니다.
        
    4. `(캐시 로직)` 응답을 브라우저로 중계(`Rio_writen`)한 후, **`cache_insert(uri, response_data, size)`**를 호출하여 캐시에 저장합니다.
        
    5. 이때 `response_data`의 메모리 관리(복사 후 `free`할지, 소유권을 넘길지)를 주의해야 합니다.
        

#### 4. 23:00 ~ 23:30 (30분): 통합 테스트 및 디버깅

- `driver.sh`를 실행해서 **Cache 점수**를 확인합니다.
    
- `valgrind --tool=memcheck` (메모리 릭)와 `valgrind --tool=helgrind` (레이스 컨디션)를 돌려봅니다.
    
- "큰 파일" 테스트로 캐시가 실제로 동작하는지(두 번째 요청이 즉시 로드되는지) 확인합니다.