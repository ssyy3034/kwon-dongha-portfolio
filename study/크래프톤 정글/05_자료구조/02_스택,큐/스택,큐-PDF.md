---
date: 2025-10-10
tags: [Algorithm]
---

# 🧩 Stack & Queue Programming Assignment (Section C)

> **과제 내용:**  
> 아래 7문제 중 **1개를 선택**하여 C언어로 구현해야 함.  
> 주어진 템플릿(“APAS system”)을 반드시 사용하고, 함수 원형(prototype)은 그대로 유지할 것.

---

0## 1️⃣ createQueueFromLinkedList

### 🧠 개요

연결리스트(LinkedList)에 저장된 모든 정수를 **큐(Queue)**에 차례대로 넣는 함수 작성.

### 🧩 요구사항

- 큐가 비어있지 않다면, **시작 전에 큐를 비워야 함**.
    
- 연결리스트의 첫 번째 노드부터 마지막 노드까지 순서대로 enqueue() 수행.
    

```c
void createQueueFromLinkedList(LinkedList *ll, Queue *q);
```

### 💡 예시

```
Linked List: 1 2 3 4 5
결과 Queue: 1 2 3 4 5
```

---

## 2️⃣ createStackFromLinkedList

### 🧠 개요

연결리스트의 모든 정수를 **스택(Stack)**에 순서대로 넣는 함수 작성.

### 🧩 요구사항

- 스택이 비어있지 않다면, **시작 전에 비워야 함**.
    
- 연결리스트의 **첫 노드부터 순서대로 push()** 하며,  
    결과적으로 스택의 top은 **마지막 노드 값**이 된다.
    

```c
void createStackFromLinkedList(LinkedList *ll, Stack *stack);
```

### 💡 예시

```
Linked List: 1 3 5 6 7
결과 Stack: 7 6 5 3 1  (top → bottom)
```

---

## 3️⃣ isStackPairwiseConsecutive

### 🧠 개요

스택 안의 정수들이 **짝(pair)** 단위로 연속적인(consecutive)지 검사하는 함수.

### 🧩 요구사항

- push() / pop()만 사용해야 함.
    
- 스택의 길이가 홀수이면 0 반환.
    
- 모든 짝 (예: (16,15), (11,10), (5,4))이 연속적이면 1 반환, 아니면 0 반환.
    

```c
int isStackPairwiseConsecutive(Stack *s);
```

### 💡 예시

```
Stack: 16 15 11 10 5 4 → 연속적 ✅
Stack: 16 15 11 10 5 1 → 연속적 ❌
Stack: 16 15 11 10 5   → 연속적 ❌ (홀수 개)
```

---

## 4️⃣ reverseQueue

### 🧠 개요

**스택을 사용해 큐를 뒤집는(reverse)** 함수 작성.

### 🧩 요구사항

- push()/pop()만 스택 조작에 사용.
    
- enqueue()/dequeue()만 큐 조작에 사용.
    
- 스택은 시작 전에 비워야 함.
    

```c
void reverseQueue(Queue *q);
```

### 💡 예시

```
Queue: (1, 2, 3, 4, 5)
결과: (5, 4, 3, 2, 1)
```

---

## 5️⃣ recursiveReverseQueue

### 🧠 개요

**재귀(Recursion)**를 이용해 큐의 순서를 뒤집는 함수 작성.

### 🧩 요구사항

- 큐의 원소를 dequeue()로 하나 꺼내고, 재귀 호출로 나머지를 뒤집은 후 enqueue()로 다시 넣는다.
    

```c
void recursiveReverseQueue(Queue *q);
```

### 💡 예시

```
Queue: (1, 2, 3, 4, 5)
결과: (5, 4, 3, 2, 1)
```

---

## 6️⃣ removeUntilStack

### 🧠 개요

스택에서 **지정한 값(value)**이 나올 때까지 pop하는 함수.

### 🧩 요구사항

- 지정한 값이 처음 나올 때까지만 pop 수행.
    
- 그 값 이후의 요소들은 그대로 남김.
    

```c
void removeUntilStack(Stack *s, int value);
```

### 💡 예시

```
Stack: (1, 2, 3, 4, 5, 6, 7), value=4 → (4, 5, 6, 7)
Stack: (10, 20, 15, 25, 5), value=15 → (15, 25, 5)
```

---

## 7️⃣ balanced

### 🧠 개요

괄호로 이루어진 문자열이 **균형잡혀 있는지** 검사하는 함수.

### 🧩 요구사항

- push()/pop()만 사용해 검사.
    
- 괄호의 짝이 정확히 맞아야 함: `() [] {}` 모두 고려.
    
- 마지막에 스택이 비어있어야 “balanced”로 판단.
    

```c
int balanced(char *expression);
```

### 💡 예시

#### ✅ 균형 잡힌 예

```
()
([])
{[]()[]}
```

#### ❌ 균형 깨진 예

```
{{)]  
[({{)])
```

---

## 💬 핵심 정리

|번호|함수명|주제|키 포인트|
|:-:|:--|:--|:--|
|1|createQueueFromLinkedList|연결리스트 → 큐|FIFO로 그대로 넣기|
|2|createStackFromLinkedList|연결리스트 → 스택|FILO로 역순 저장|
|3|isStackPairwiseConsecutive|스택 짝 검사|인접 두 값이 연속인지|
|4|reverseQueue|큐 뒤집기|스택 활용|
|5|recursiveReverseQueue|재귀 큐 뒤집기|dequeue + enqueue|
|6|removeUntilStack|스택 pop 제어|특정 값까지 제거|
|7|balanced|괄호 균형 검사|스택으로 괄호 매칭|
