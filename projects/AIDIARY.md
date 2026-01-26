# Aidiary - 풀스택 개발 챌린지

> 3인 팀 프로젝트 | **Full-stack Developer** | Spring Boot + React + Python

AI 기반 육아 기록 플랫폼의 전체 스택을 담당하며 프론트엔드 상태관리 최적화와 마이크로서비스 아키텍처를 경험했습니다.

---

## 1. 프론트엔드 상태 관리 최적화: 코드량 40% 감소

### 문제 상황

다수의 useState와 prop drilling으로 인해 코드 복잡도가 급격히 증가했습니다.

- **현상**: 같은 데이터를 여러 컴포넌트에서 중복 관리
- **문제**: 상위 컴포넌트에서 하위로 props를 5단계 이상 전달

### 해결 과정

Zustand 스토어 기반으로 상태를 일원화하고, Custom Hooks로 비즈니스 로직을 분리했습니다.

```typescript
// Before: Prop Drilling + 중복 상태
<GrandParent>
  <Parent data={data} setData={setData}>
    <Child data={data} setData={setData}>
      <GrandChild data={data} setData={setData} />

// After: Zustand + Custom Hooks
// stores/characterStore.ts
export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  addCharacter: (char) => set((state) => ({
    characters: [...state.characters, char]
  })),
}));

// hooks/useCharacter.ts - 비즈니스 로직 분리
export function useCharacter(id: string) {
  const character = useCharacterStore(
    (state) => state.characters.find(c => c.id === id)
  );
  const updateCharacter = useCharacterStore((state) => state.update);

  return { character, updateCharacter };
}
```

### 성과

| 지표 | Before | After | 개선 |
|:-----|:-------|:------|:-----|
| **코드 라인 수** | 2,400줄 | 1,440줄 | **40% 감소** |
| **Prop Drilling** | 5단계 | 0단계 | **완전 제거** |
| **상태 중복** | 12개 | 4개 | **67% 감소** |

---

## 2. Hybrid AI Architecture: 메인 서버 블로킹 제거

### 문제 상황

AI 이미지 생성(DALL-E 3) 시 30초+ 대기 시간으로 인해 메인 서버 스레드가 차단되어 다른 요청 처리가 불가능했습니다.

### 해결 과정

"적재적소(Right Tool for the Right Job)" 원칙으로 서비스를 분리했습니다.

```
[Client] → [Spring Boot] → [Python Flask]
              ↓                    ↓
         비즈니스 로직         AI 연산
         데이터 무결성         Face Analysis
         보안/인증            DALL-E API
```

1. **Spring Boot**: 비즈니스 로직, 트랜잭션, 보안 담당
2. **Python Flask**: AI/ML 라이브러리 활용 (face-cli, OpenAI API)
3. **RestTemplate**: 서비스 간 비동기 통신 파이프라인

### 성과

- 메인 서버 응답 시간: **30초 → 200ms** (AI 요청 제외한 일반 API)
- AI 요청 중에도 다른 사용자 요청 **정상 처리**

---

## 3. End-to-End AI Pipeline: 얼굴 특징점 68개 자동 추출

### 문제 상황

"부모 사진으로 아이 얼굴 예측"이라는 요구사항을 단순 API 호출로 구현할 수 없었습니다.

### 해결 과정

데이터 전처리부터 생성까지 완전한 파이프라인을 구축했습니다.

```
[사용자 업로드] → [face-cli 분석] → [프롬프트 생성] → [DALL-E 3] → [결과 반환]
                     ↓
              68개 특징점 추출
              (눈, 코, 입, 얼굴형)
```

1. **Input**: 부모 사진 업로드
2. **Preprocessing**: face-cli로 얼굴 특징점 68개 정밀 추출
3. **Prompt Engineering**: 특징을 자연어 프롬프트로 자동 변환
4. **Generation**: DALL-E 3 API 호출 및 결과 반환

### 성과

- 얼굴 특징점 추출: **수동 → 자동 (68개)**
- 프롬프트 생성: **템플릿 기반 자동화**

---

## 4. Docker Compose로 전 계층 오케스트레이션

### 구성

```yaml
services:
  frontend:     # React 18 + Nginx
  backend:      # Spring Boot 3.4
  ai-service:   # Python Flask
  db:           # MariaDB
  prometheus:   # 메트릭 수집
  grafana:      # 시각화 대시보드
```

### 성과

- `docker-compose up` 한 줄로 **전체 환경 구축**
- Prometheus + Grafana로 **실시간 모니터링** 환경 구축

---

## Tech Stack

| 영역 | 기술 |
|:-----|:-----|
| **Backend** | Java 17, Spring Boot 3.4, Python 3.9, Flask |
| **Frontend** | React 18, TypeScript, Zustand, TailwindCSS |
| **Database** | MariaDB |
| **AI/ML** | OpenAI API (DALL-E 3), face-cli |
| **Infra** | Docker, Docker Compose, Prometheus, Grafana |
