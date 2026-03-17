import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const heapUsedMB = new Trend('heap_used_mb');
const activeSessions = new Trend('active_sessions');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const TURNS_PER_SESSION = 5;

export const options = {
  vus: 10,
  iterations: 200,
  thresholds: {
    http_req_duration: ['p(95)<5000'],
  },
};

const MESSAGES = [
  '권동하는 어떤 개발자인가요?',
  'StoLink 프로젝트에 대해 알려주세요',
  'API 성능 개선은 어떻게 했나요?',
  '크래프톤 정글 경험이 궁금합니다',
  '기술 스택은 무엇인가요?',
];

export default function () {
  const sessionId = uuidv4();

  for (let i = 0; i < TURNS_PER_SESSION; i++) {
    const payload = JSON.stringify({
      sessionId,
      message: MESSAGES[i % MESSAGES.length],
    });

    const res = http.post(`${BASE_URL}/api/chat`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, { 'chat status 201': (r) => r.status === 201 });
    sleep(0.3);
  }

  // Collect memory stats after each iteration
  const memRes = http.get(`${BASE_URL}/api/debug/memory`);
  if (memRes.status === 200) {
    const stats = JSON.parse(memRes.body);
    heapUsedMB.add(stats.heapUsedMB);
    activeSessions.add(stats.activeSessionCount);
  }
}
