---
date: 2025-09-19
category: 알고리즘
week: 38
tags: [Algorithm, CLRS, 그래프이론, 반복, 알고리즘]
---

# BFS (Breadth-First Search) 정리

## 0) 핵심 정의

BFS는 **너비 우선 탐색**으로, 시작 정점에서 가까운 정점부터 차례대로(계층적으로) 방문하는 알고리즘이다.  
**무가중치 그래프에서 최단 경로를 보장**하는 탐색법이다.

---

## 1) 동작 흐름

1. **시작 정점 enqueue**
    
    - 단일 시작점 BFS → 시작 정점 하나만 큐에 넣음
        
    - 다중 시작점 BFS → 레벨 0에 해당하는 모든 시작 정점을 큐에 넣음
        
2. 큐에서 정점을 dequeue
    
3. 인접 정점 확인
    
    - 방문하지 않은 정점은 `GRAY`로 표시, 거리 `d = u.d + 1`, 큐에 enqueue
        
4. 해당 정점은 처리 완료 후 `BLACK`으로 표시
    
5. **큐가 빌 때까지 반복**
    

---

## 2) 색상 규칙

- `WHITE`: 아직 발견되지 않음
    
- `GRAY`: 발견되어 큐에 들어감 (방문 예정)
    
- `BLACK`: 인접 탐색까지 완료됨
    

---

## 3) BFS의 특징

- **큐(FIFO)** 사용 → 계층적 탐색
    
- **무가중치 그래프에서 최단 경로 보장**
    
- 주요 응용
    
    - 최단 거리(간선 수) 계산
        
    - 연결 요소(component) 탐색
        
    - 이분 그래프 판별 (짝수/홀수 레벨 색칠)
        

---

## 4) BFS 의사코드 (CLRS 버전)

```text
BFS(G, s):
  for each u in G.V - {s}:
    u.color = WHITE
    u.d = ∞
    u.π = NIL
  s.color = GRAY
  s.d = 0
  s.π = NIL
  Q = ∅
  ENQUEUE(Q, s)

  while Q ≠ ∅:
    u = DEQUEUE(Q)
    for each v in G.Adj[u]:
      if v.color == WHITE:
        v.color = GRAY
        v.d = u.d + 1
        v.π = u
        ENQUEUE(Q, v)
    u.color = BLACK
```

---

## 5) 시간 복잡도

- 정점 탐색: $O(V)$
    
- 간선 탐색: $O(E)$
    
- **총합: $O(V+E)$**
    

---

## 📌 한 줄 요약

**BFS는 큐를 이용해 시작 정점에서 가까운 정점부터 탐색하며, 무가중치 그래프의 최단 경로를 찾는 알고리즘이다.**
