---
date: 2025-09-26
tags: [DevOps]
---

b phase_1
b phase_2
b phase_3
b phase_4
b phase_5
b phase_6
b secret_phase
b explode_bomb

# 0) 컨테이너 들어가기

맥 터미널에서 bomb 파일 폴더로 이동 후 컨테이너 실행(이미 실행 중이면 `docker exec`로 2번째 쉘 열어도 됨):

```bash
cd ~/Downloads/bomb   # ← bomb 파일이 있는 경로
docker run --platform=linux/amd64 -it --rm -v "$(pwd)":/work -w /work ubuntu:22.04 bash
```

필요 패키지 설치:

```bash
apt update -y
apt install -y qemu-user gdb file binutils less
```

---

# 1) 터미널 A: QEMU를 gdb 서버로 띄우기

터미널 A(컨테이너 안)에서 **대기 모드**로 실행:

```bash
# 입력이 필요 없으면
qemu-x86_64 -g 1234 ./bomb

# stdin으로 테스트 문자열을 넣고 싶으면 (예: phase1 정답 후보)
# echo "teststring" > p1.txt
# qemu-x86_64 -g 1234 ./bomb < p1.txt
```

- `-g 1234` → 1234 포트에서 GDB 접속을 기다림.
    
- 이 창은 “Waiting for gdb connection on port 1234” 같은 상태로 대기하게 된다.
    

---

# 2) 터미널 B: GDB로 접속

호스트에서 같은 컨테이너로 2번째 쉘 열기:

```bash
docker ps   # 컨테이너 ID 확인
docker exec -it <컨테이너ID> bash
cd /work
```

GDB 실행 후 **심볼 로드 → 원격 접속**:

```bash
gdb -q ./bomb
(gdb) file ./bomb          # 심볼/섹션 로드 (중요)
(gdb) target remote :1234  # QEMU gdb-stub에 붙기
```

브레이크포인트 & 진행:

```gdb
(gdb) break explode_bomb
(gdb) break strings_not_equal
(gdb) break main
(gdb) c                    # continue (QEMU 쪽이 실행 시작)
```

비교 지점에서 멈추면 인자/문자열 확인:

```gdb
(gdb) info registers rdi rsi
(gdb) x/s $rdi
(gdb) x/s $rsi
(gdb) bt                   # 누가 호출했는지(phase_1 등) 보기
```

---

# 3) 입력 바꿔가며 재시도하는 요령

- **입력을 바꾸려면 터미널 A에서 QEMU를 종료**하고, 새 입력으로 다시 띄워야 해:
    
    ```bash
    # 터미널 A
    pkill -f "qemu-x86_64 -g 1234"  # 또는 Ctrl-C
    echo "새_시도_문자열" > p1.txt
    qemu-x86_64 -g 1234 ./bomb < p1.txt
    ```
    
- 터미널 B(GDB)는 보통 연결이 끊어지므로, 다시:
    
    ```gdb
    (gdb) target remote :1234
    (gdb) c
    ```
    

원하면 GDB에서 간단 단축키 만들어도 좋다:

```gdb
(gdb) define rr
Type commands for definition of "rr".
End with a line saying just "end".
>target remote :1234
>c
>end
# 사용: (gdb) rr
```

---

# 4) 흔한 실수/트러블슈팅

- **`Connection refused`**: 터미널 A에서 QEMU가 떠있는지 확인. 포트(1234) 충돌 시 다른 포트 사용(`-g 4444`) 후 `target remote :4444`.
    
- **심볼이 안 잡히고 주소만 보일 때**: `file ./bomb`를 반드시 `target remote` 전에 실행.
    
- **레지스터가 말이 안 맞는다**: remote 모드에서는 `$rdi/$rsi`가 정상적으로 x86_64 규약을 따른다. (`x/s $rdi`, `x/s $rsi`로 문자열 확인)
    
- **여러 번 브레이크 걸릴 때**: `disable 1` 같은 걸로 필요 없는 브레이크 비활성화.
    
- **ASLR 때문에 주소가 바뀌어 보일 때**: 보통 qemu-user에서는 큰 문제 없지만, 반복 실행마다 달라지면 브레이크는 심볼 기반으로 건다(예: `break strings_not_equal`, `break phase_1`).
    

---

# 5) Bomb Lab Phase 1 빠른 루틴 (qemu-stub 가정)

터미널 A:

```bash
qemu-x86_64 -g 1234 ./bomb < /dev/null
```

터미널 B:

```gdb
gdb -q ./bomb
(gdb) file ./bomb
(gdb) target remote :1234
(gdb) break strings_not_equal
(gdb) break explode_bomb
(gdb) c
# 멈추면
(gdb) x/s $rdi
(gdb) x/s $rsi
# 상수 문자열(.rodata 주소)이 보이면 그걸 정답 후보로 파일 생성
```

다시 테스트:

```bash
# 터미널 A
pkill -f "qemu-x86_64 -g 1234"
echo "방금_본_문자열" > p1.txt
qemu-x86_64 -g 1234 ./bomb < p1.txt
```

```gdb
# 터미널 B
(gdb) target remote :1234
(gdb) c
```

폭발하지 않고 다음 단계로 넘어가면 성공.

---
