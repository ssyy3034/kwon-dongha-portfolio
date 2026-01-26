---
date: 2025-10-30
tags: [CS]
---

**RIO(Robust I/O)** 패키지는 유닉스 `read`와 `write` 함수가 [[Short Count]]를 반환하는 문제를 해결하기 위해 CSAPP 책에서 특별히 제작한 I/O 라이브러리입니다.

- **핵심 기능:** short count가 발생하면, 요청된 모든 데이터가 전송될 때까지 자동으로 `read`/`write`를 반복 호출하여 데이터 전송의 **안정성(Robustness)** 을 보장합니다.
    
- **구성:** 버퍼를 사용하지 않는 함수(`rio_readn`, `rio_writen`)와 버퍼를 사용하는 입력 함수(`rio_readlineb`, `rio_readnb`)로 구성되어 있습니다. 특히 네트워크 소켓 I/O에 사용하는 것이 권장됩니다.