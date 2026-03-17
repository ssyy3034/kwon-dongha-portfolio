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

export const options = {
  scenarios: {
    load_phase: {
      executor: 'constant-vus',
      vus: 20,
      duration: '5m',
      exec: 'chatPhase',
    },
    idle_phase: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5m',
      startTime: '5m',
      exec: 'idlePhase',
    },
    verify_phase: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      startTime: '10m',
      exec: 'verifyPhase',
    },
  },
};

export function chatPhase() {
  const sessionId = uuidv4();
  const payload = JSON.stringify({
    sessionId,
    message: '테스트 메시지입니다',
  });

  const res = http.post(`${BASE_URL}/api/chat`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'chat status 201': (r) => r.status === 201 });

  // Periodic memory check
  if (Math.random() < 0.05) {
    const memRes = http.get(`${BASE_URL}/api/debug/memory`);
    if (memRes.status === 200) {
      const stats = JSON.parse(memRes.body);
      heapUsedMB.add(stats.heapUsedMB);
      activeSessions.add(stats.activeSessionCount);
    }
  }

  sleep(0.5);
}

export function idlePhase() {
  // During idle, just poll memory stats every 30 seconds
  const memRes = http.get(`${BASE_URL}/api/debug/memory`);
  if (memRes.status === 200) {
    const stats = JSON.parse(memRes.body);
    heapUsedMB.add(stats.heapUsedMB);
    activeSessions.add(stats.activeSessionCount);
    console.log(
      `[idle] heap: ${stats.heapUsedMB}MB, sessions: ${stats.activeSessionCount}, entries: ${stats.totalEntryCount}`,
    );
  }
  sleep(30);
}

export function verifyPhase() {
  const memRes = http.get(`${BASE_URL}/api/debug/memory`);
  check(memRes, { 'verify status 200': (r) => r.status === 200 });

  if (memRes.status === 200) {
    const stats = JSON.parse(memRes.body);
    heapUsedMB.add(stats.heapUsedMB);
    activeSessions.add(stats.activeSessionCount);
    console.log(`[verify] Final stats: ${JSON.stringify(stats)}`);

    check(stats, {
      'sessions cleaned after TTL': (s) => s.activeSessionCount === 0,
    });
  }
}
