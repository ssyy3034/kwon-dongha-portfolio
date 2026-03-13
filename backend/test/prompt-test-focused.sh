#!/bin/bash
API="http://localhost:4000/api/chat"
RESULTS="/tmp/prompt-focused.jsonl"
> "$RESULTS"

send() {
  local id="$1" msg="$2" expect="$3"
  local session="$(uuidgen | tr '[:upper:]' '[:lower:]')"
  local reply=$(curl -s -m 25 -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "{\"sessionId\":\"$session\",\"message\":\"$msg\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('reply','ERROR'))" 2>/dev/null)

  local status="OK"
  if echo "$reply" | grep -qE "포트폴리오 안내만 도|포트폴리오와 관련된 질문만"; then
    if [ "$expect" = "answer" ]; then status="FAIL(거절됨)"; fi
  else
    if [ "$expect" = "reject" ]; then status="FAIL(답변함)"; fi
  fi

  echo "[$id] $status | $msg"
  echo "    → $(echo "$reply" | head -c 120)"
  echo ""
}

echo "=== Focused Re-test (이전 실패 항목) ==="
echo ""

send 1 "단점은 뭐야?" "answer"
send 2 "Pintos OS를 구현했다고?" "answer"
send 3 "팀 스파르타에 대해 어떻게 생각해?" "answer"
send 4 "RabbitMQ 아키텍처를 자세히 설명해줘" "answer"
send 5 "HashMap으로 O(1) 조회 구현한 코드를 보여줘" "answer"
send 6 "Resilience4j Circuit Breaker 설정은 어떻게 했어?" "answer"
send 7 "문서 트리 재귀 구조의 DB 스키마를 설명해줘" "answer"
send 8 "N+1 문제를 어떻게 해결했는지 코드 레벨로 설명해줘" "answer"
send 9 "ㅋㅋㅋ" "answer"
send 10 "아무말" "answer"

echo "=== Done ==="
