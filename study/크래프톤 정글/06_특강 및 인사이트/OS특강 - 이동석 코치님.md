---
date: 2025-11-07
tags: [CS]
---

쓰레드를 먼저 이해해야함.
프로세스 몇백개가 컴퓨터에서 돌고 있는데 cpu는 하나. 어떻게 하는걸까?
하나가 선점하고 돌아버리면 무한루프 돌때 컴퓨터 멈춰버림
프로세스가 알아서 양보하면 안되나? 그래주지 않음
그래서 OS가 강제로 끊어줘야함.
 - clock : 일정한 간격으로 시그널 발생시킴
clock이 돌때마다 timer_handler라는 함수 호출 가능.
timer_handler 내부 동작으로 clock에 의해 프로세스 변경 가능.

이번 챕터에는 스레드 스케줄링을 구현해야함.
device/timer.c -> timer_interupt()함수가 하드웨어 인터럽트마다 돌아가는 핸들러.
내부적으로 thread_tick을 호출하니까 이것도 봐야함.

첫번째는 busy waits을 수정해야함.

timer_sleep(tick)은 tick 동안 스레드를 재우겠다는건데, 현재 구현은 그냥 양보임.
현재시간+sleep에서 받는 tick동안 재우는 함수.
내부적으로 while로 돌고있으니 cpu가 계속 잡게 되어, 필요없는 컨텍스트 스위칭이 자꾸 일어남
readylist 말고도 sleeplist 만들어야 된다.
sleeplist가 정렬되어 있다면 헤드 노드의 틱 값이랑 현재 틱만 비교해서 꺼내주면 됨.(timer_handler에서 구현)

여기까지 첫번째

문제가 있음. clock의 인터럽트가 handler 동작중이거나 스레드 스케줄링중 끼어들면 예측할수 없는 동작이 일어남. 그래서 임계 영역에 접근할때는 인터럽트를 꺼버려야함.
동기화도 신경써야함.(세마포어,락)

두번째는 우선순위 스케줄링 필요함
우선순위가 주어지면 우선순위 순서대로 실행되어야 함.
넣을때 정렬해서 넣어라.
또 하나의 방법은 timer_handler 돌때 sorting
priority inversion, priority donation도 구현해야함.
리소스에 락을 획득한 채, 우선순위가 다른 프로세스가 각자 실행되면 데드락 위험이 있음. 그걸 해결하기 위해 낮은 우선순위 프로세스에게 우선순위를 넘겨주는 개념. 제일 어렵다.

시간 남으면 mlfqs 구현. 모던 OS 스케줄링 방식임. 도전 해보면 좋을듯
lib/kernel/list.c 제대로 보고 시작해야함.
hash도.

원래는 make check로 tc를 돌려야함.
test/threads 밑에 있는 c 파일이 실제 테스트 파일. 실패하면 무슨 내용인지 봐야함.
ck는 테스트가 성공할때 나오는 printf를 체크해서 같으면 pass, 다르면 fail.
c 파일에 대한 모범 답안이(출력이) ck.
make build/tests/alarm-multiple.result
같은 방법으로 한 테스트 케이스를 찍어볼수 있음.
테스트 돌릴때 printf 지우고 하셔라.

우선순위 donation 열심히 하도록.

