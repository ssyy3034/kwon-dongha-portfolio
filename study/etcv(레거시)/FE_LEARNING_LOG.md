---
date: 2026-01-22
tags: [Frontend]
---

# StoLink Frontend: Technical Retrospective & Learning Log

> **버전**: 1.0
> **최종 수정**: 2026년 1월 22일
> **작성자**: StoLink Frontend Team

본 문서는 StoLink 프로젝트의 프론트엔드 개발 과정에서 축적된 핵심 기술 결정, 아키텍처 설계, 성능 최적화 경험을 집약한 학습 기록입니다.

---

## 1. 아키텍처 및 기술 스택 (Architecture & Tech Stack)

### 📌 기술 스택 선정 근거

- **React 19.2 + Vite 7.2**: SEO가 불필요한 작가 전용 도구로서 SPA의 빠른 인터랙션과 Vite의 고속 HMR을 최우선으로 고려하였습니다.
- **TypeScript 5.9**: 20,000 LOC 이상의 대규모 코드베이스에서 타입 안전성을 확보하고 런타임 에러를 방지하기 위해 Strict Mode를 준수하였습니다.
- **Tailwind CSS + shadcn/ui**: "Mocha & Cloud" 디자인 시스템의 Warm & Soft 감성을 신속하게 구현하고, 접근성(A11y)이 보장된 UI를 구축하였습니다.

### 📌 하이브리드 상태 관리 전략

서버 상태와 클라이언트 UI 상태를 명확히 분리하여 관심사를 분산시켰습니다.

- **Server State**: `TanStack Query 5.90` (캐싱, Optimistic Update, 자동 리패칭)
- **Client State**: `Zustand 5.0` (8개 이상의 도메인별 스토어 분리, persist/immer 미들웨어 활용)
- **Form State**: `React Hook Form` + `Zod` (강력한 런타임 스키마 검증)

---

## 2. 에디터 시스템 (Tiptap Editor System)

StoLink의 핵심인 에디터는 **Tiptap 3.14 (ProseMirror 기반)**를 활용하여 고도로 커스터마이징되었습니다.

### 📌 주요 구현 사항

- **커스텀 익스텐션 (16개)**: `@캐릭터 멘션`, `#복선 태그`, `타자기 모드`, `집중 모드` 등 작가 특화 기능 구현
- **에디터 모듈화 (Performance)**: `@tiptap/starter-kit`의 오버헤드를 줄이기 위해 필수 패키지만 개별적으로 임포트하여 에디터 청크 크기를 **32% (128KB) 절감**하였습니다.
- **인스펙터 (Inspector) 아키텍처**: 현재 집필 중인 문맥을 AI가 인식하여 우측 패널에 관련 캐릭터와 설정을 자동으로 노출합니다.

---

## 3. 시각화 및 인터랙션 (Character Graph)

캐릭터 관계도의 성능과 심미성을 위해 **D3.js Force Simulation**을 도입하였습니다.

### 📌 기술적 성과

- **React Flow → D3 Canvas 전환**: 수동 배치 방식에서 물리 기반 자동 배치로 전환하고, 렌더링 성능을 극대화하기 위해 Canvas 방식을 채택하였습니다.
- **60fps 안정화**: `useCallback` 메모이제이션과 `requestAnimationFrame` 최적화를 통해 노드 100개 이상에서도 끊김 없는 줌/드래그 인터랙션을 실현하였습니다.
- **메모리 관리**: 컴포넌트 언마운트 시 D3 Selection 캐시를 명시적으로 정리하여 메모리 누수를 원격 차단하였습니다.

---

## 4. AI integration & 비동기 파이프라인

### 📌 증분 분석 (Incremental Analysis)

- **IndexedDB 버퍼링**: 사용자의 입력을 로컬 버퍼에 임시 저장하고, 특정 임계치(10,000자 또는 30분) 도달 시에만 분석을 요청하여 서버 부하를 최소화하였습니다.
- **Content Hashing**: 분석 요청 전 해시 비교를 통해 내용 변경이 없는 경우 중복 요청을 방지하는 로직을 구현하였습니다.

### 📌 Async Polling 시스템

- **SSE → Polling 전환**: 네트워크 불안정성을 고려하여 기존 SSE 방식 대신 견고한 **Polling-based Job Tracking**으로 전환, 장시간 소요되는 AI 분석 작업의 상태를 안정적으로 동기화하였습니다.

---

## 5. 성능 및 사용자 경험 (Performance & UX)

Lighthouse 지표 개선을 통해 사용자 체감 성능을 혁신적으로 향상시켰습니다.

### 📌 Lighthouse 최적화 성과

| 지표                               | 개선 전 | 개선 후   | 개선율   |
| :--------------------------------- | :------ | :-------- | :------- |
| **LCP (Largest Contentful Paint)** | 3.8s    | **1.8s**  | **-52%** |
| **CLS (Cumulative Layout Shift)**  | 0.429   | **0.003** | **-99%** |
| **Accessibility**                  | 88      | **100**   | **+12%** |

### 📌 핵심 기술적 적용

- **폰트 자체 호스팅 & 프리로드**: 외부 CDN 의존성을 제거하고 핵심 woff2 폰트를 직접 서빙하여 렌더링 블로킹을 해소하였습니다.
- **예측 로딩 (Predictive Loading)**: 서재 페이지에서 작품 카드 호버 시 에디터 청크를 미리 프리패칭하여 페이지 전환 속도를 0초에 가깝게 단축하였습니다.
- **데이터 프리패칭 (Data Prefetching)**: `ProjectLayout` 진입 시 초기 진입에 필요한 데이터를 미리 로드하여 Network Waterfall을 최적화하였습니다.

---

## 6. 코드 품질 및 설계 원칙 (Code Quality)

- **트리 구조 메모이제이션 (O(1))**: 챕터/섹션 트리 계산 시 `useMemo`를 통해 복잡한 정렬 연산을 최적화하여 연산량을 99% 감소시켰습니다.
- **타입 가드 활용**: `axios.isAxiosError` 등 구체적인 타입 가드를 활용하여 API 에러 처리에서의 `any` 사용을 지양하고 런타임 안전성을 확보하였습니다.
- **Feature-Slice 아키텍처**: 레이어간 단방향 의존성을 엄격히 준수하여 유지보수 용이성을 극대화하였습니다.

---

## 🏁 마무리하며

StoLink 프론트엔드 개발은 단순히 기능을 구현하는 것을 넘어, **"작가에게 가장 쾌적한 집필 환경을 제공한다"**는 목표 아래 성능, UX, 코드 품질의 조화를 이루는 과정이었습니다. 본 기록이 향후 프로젝트 유지보수와 기술적 성장의 밑거름이 되기를 바랍니다.
