---
date: 2025-10-30
---

RIO 패키지의 **버퍼 없는(unbuffered)** 입출력 함수들입니다. 메모리와 파일(주로 네트워크 소켓) 사이에서 데이터를 직접 전송합니다.

- **`rio_readn(fd, usrbuf, n)`:** `fd`에서 최대 `n` 바이트를 읽어 `usrbuf`로 복사합니다. EOF를 제외하고는 절대 short count를 반환하지 않습니다. 내부적으로 `read`가 short count를 반환하면, `n` 바이트를 다 읽을 때까지 계속해서 `read`를 다시 호출합니다.
    
- **`rio_writen(fd, usrbuf, n)`:** `usrbuf`에 있는 데이터 `n` 바이트를 `fd`로 복사합니다. 이 함수는 절대 short count를 반환하지 않습니다.