---
date: 2025-09-19
category: 알고리즘
week: 38
tags: [Algorithm, CLRS, 그래프이론, 알고리즘, 재귀]
---

## 0) 핵심 정의

DFS는 이름 그대로 **가능한 깊숙이 들어갔다가**, 더 이상 갈 수 없으면 **뒤로 돌아와 다른 갈래를 타는** 탐색이다. 이 과정에서 그래프의 구조(경로, 트리, 사이클 등)를 드러내는 강력한 도구가 된다.

---

## 1) DFS의 동작 흐름

1. 모든 정점을 **WHITE**로 초기화.
    
2. 어떤 WHITE 정점을 만나면 `DFS-VISIT` 호출 → 이 정점은 **GRAY**(발견됨)으로 바뀜.
    
3. 인접 리스트를 따라 WHITE 이웃이 있으면 재귀적으로 `DFS-VISIT` 실행.
    
4. 모든 인접 정점을 다 처리하면 해당 정점은 **BLACK**(완료됨)으로 바뀌고 종료.
    
5. 모든 정점이 BLACK이 될 때까지 반복.
    

DFS는 BFS와 달리 큐(FIFO)를 쓰지 않고, **재귀 호출(혹은 스택)**으로 “깊이”를 탐색한다.

---

## 2) DFS의 산출물

- **DFS forest**: 여러 개의 DFS tree로 이루어진 숲이 형성됨.  
    → BFS는 보통 한 소스에서 출발한 하나의 트리를 만들지만, DFS는 disconnected graph에서도 모든 정점을 방문해야 하므로 forest가 된다.
    
- **Predecessor π[v]**: BFS와 마찬가지로 경로 추적이 가능.
    
- **Timestamps**: 각 정점은 두 개의 시간값을 가진다.
    
    - $d[v]$: 발견 시간 (discovery time)
        
    - $f[v]$: 종료 시간 (finish time)
        
    
    항상 $d[v] < f[v]$. 이 값들로 정점 간 포함 관계 및 DFS 구조를 파악할 수 있다.
    

---

## 3) DFS 의사코드 (CLRS 요약)

```text
DFS(G):
  for each vertex u in G.V:
    color[u] = WHITE
    π[u] = NIL
  time = 0
  for each vertex u in G.V:
    if color[u] == WHITE:
      DFS-VISIT(G, u)

DFS-VISIT(G, u):
  time = time + 1
  d[u] = time
  color[u] = GRAY
  for each v in Adj[u]:
    if color[v] == WHITE:
      π[v] = u
      DFS-VISIT(G, v)
  color[u] = BLACK
  time = time + 1
  f[u] = time
```

→ 이 구조 덕분에 DFS의 **재귀 호출 깊이 = DFS tree 구조**가 된다.

---

## 4) 시간 복잡도

- 초기화: $O(V)$
    
- 모든 인접 리스트 스캔: $\sum |Adj[v]| = O(E)$
    
- 따라서 전체 DFS는 **$O(V+E)$**
    

---

## 5) DFS의 주요 성질

1. **Forest 구조**: DFS 결과는 항상 disjoint DFS tree들의 forest가 된다.
    
2. **Parenthesis Theorem (괄호 구조)**:  
    발견-종료 시간 $[d[u], f[u]]$ 구간은 다른 정점 구간과 **포함 관계**이거나 **완전히 분리**되어 있다.  
    → DFS는 “괄호 친 구조”를 만들어낸다.
    
3. **Edge Classification (간선 분류)**: DFS 중 만나는 간선은 네 가지로 나뉜다.
    
    - **Tree edge**: WHITE 정점으로 가는 간선
        
    - **Back edge**: GRAY(조상)으로 가는 간선 → 사이클 존재를 증명
        
    - **Forward edge**: BLACK 정점(자손)으로 가는 경우
        
    - **Cross edge**: BLACK 정점(자손 아님)으로 가는 경우
        
    
    → **무방향 그래프**에서는 forward/cross edge는 존재하지 않고 tree/back edge만 생긴다.
    

---

## 6) 응용 분야

DFS는 단독으로도 강력하지만, 여러 알고리즘의 **빌딩 블록**으로 쓰인다:

- **위상 정렬 (Topological Sort)**: DAG에서 정점들을 선형 순서로 나열
    
- **Strongly Connected Components (SCC)**: DFS 2번 돌려서 찾음
    
- **사이클 탐지**: Back edge 여부 확인
    
- **Biconnected Components, Articulation Points, Bridges** 찾기
    

---
