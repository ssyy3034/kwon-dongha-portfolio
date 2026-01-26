---
date: 2025-10-10
tags: [CS]
---


---

# 🌳 Binary Tree Questions Summary

> CE1007 / CZ1007 Data Structures — Section E  
> Summary & Notes for Implementation (C 언어)

---

## 1️⃣ identical()

**Prototype**

```c
int identical(BTNode *tree1, BTNode *tree2);
```

**Goal**  
두 이진 트리가 구조적으로 완전히 동일한지 확인.

**조건**

- 둘 다 `NULL`이면 동일 → `return 1`
    
- 하나만 `NULL`이면 → `return 0`
    
- 값이 다르면 → `return 0`
    
- 그 외에는 → `identical(left1, left2) * identical(right1, right2)`
    

**핵심 로직**

```c
if (tree1 == NULL && tree2 == NULL) return 1;
if (tree1 == NULL || tree2 == NULL) return 0;
if (tree1->item != tree2->item) return 0;
return identical(tree1->left, tree2->left) && identical(tree1->right, tree2->right);
```

---

## 2️⃣ maxHeight()

**Prototype**

```c
int maxHeight(BTNode *root);
```

**Goal**  
루트에서 가장 깊은 리프까지의 링크 수 반환.  
(빈 트리의 높이 = -1)

**로직**

- `NULL`이면 `-1`
    
- 왼쪽, 오른쪽의 높이 중 큰 것 + 1
    

**핵심 로직**

```c
if (root == NULL) return -1;
int left = maxHeight(root->left);
int right = maxHeight(root->right);
return (left > right ? left : right) + 1;
```

---

## 3️⃣ countOneChildNodes()

**Prototype**

```c
int countOneChildNodes(BTNode *root);
```

**Goal**  
자식이 정확히 하나인 노드의 개수 세기.

**로직**

- `NULL`이면 `0`
    
- 자식이 하나만 있으면 `1 + left + right`
    
- 둘 다 있거나 없으면 `left + right`
    

**핵심 로직**

```c
if (root == NULL) return 0;
int left = countOneChildNodes(root->left);
int right = countOneChildNodes(root->right);
if ((root->left == NULL) != (root->right == NULL)) return left + right + 1;
else return left + right;
```

---

## 4️⃣ sumOfOddNodes()

**Prototype**

```c
int sumOfOddNodes(BTNode *root);
```

**Goal**  
모든 홀수 노드의 합 구하기.

**로직**

- `NULL`이면 `0`
    
- 현재 노드가 홀수면 `item + left + right`
    
- 아니면 단순히 `left + right`
    

**핵심 로직**

```c
if (root == NULL) return 0;
int sum = sumOfOddNodes(root->left) + sumOfOddNodes(root->right);
if (root->item % 2 != 0) sum += root->item;
return sum;
```

---

## 5️⃣ mirrorTree()

**Prototype**

```c
void mirrorTree(BTNode *node);
```

**Goal**  
트리를 **미러(좌우 반전)** 시키기.

**로직**

- `NULL`이면 종료
    
- 왼쪽과 오른쪽을 swap
    
- 재귀적으로 하위 노드에 반복
    

**핵심 로직**

```c
if (node == NULL) return;
BTNode *temp = node->left;
node->left = node->right;
node->right = temp;
mirrorTree(node->left);
mirrorTree(node->right);
```

---

## 6️⃣ printSmallerValues()

**Prototype**

```c
void printSmallerValues(BTNode *node, int m);
```

**Goal**  
주어진 값 `m`보다 작은 노드의 값을 출력.  
**in-order traversal (중위 순회)** 방식 사용.

**로직**

- 왼쪽 순회 → 현재 노드 확인 → 오른쪽 순회
    
- `item < m`이면 출력
    

**핵심 로직**

```c
if (node == NULL) return;
printSmallerValues(node->left, m);
if (node->item < m) printf("%d ", node->item);
printSmallerValues(node->right, m);
```

---

## 7️⃣ smallestValue()

**Prototype**

```c
int smallestValue(BTNode *node);
```

**Goal**  
트리 내 최소값 찾기.

**로직**

- `NULL`이면 큰 값 반환 (ex. `INT_MAX`)
    
- 왼쪽, 오른쪽의 최소값과 비교 후 반환
    

**핵심 로직**

```c
if (node == NULL) return INT_MAX;
int leftMin = smallestValue(node->left);
int rightMin = smallestValue(node->right);
int min = node->item;
if (leftMin < min) min = leftMin;
if (rightMin < min) min = rightMin;
return min;
```

---

## 8️⃣ hasGreatGrandchild()

**Prototype**

```c
int hasGreatGrandchild(BTNode *node);
```

**Goal**  
**증손자(great-grandchild)**가 있는 노드를 찾아 출력.  
(즉, depth ≥ 3 인 노드)

**로직**

- 재귀로 깊이(depth) 반환
    
- 깊이가 3 이상이면 노드 값 출력
    
- 각 호출은 자신의 subtree의 높이 리턴
    

**핵심 로직**

```c
if (node == NULL) return -1;
int leftDepth = hasGreatGrandchild(node->left);
int rightDepth = hasGreatGrandchild(node->right);
int depth = (leftDepth > rightDepth ? leftDepth : rightDepth) + 1;
if (depth >= 3) printf("%d ", node->item);
return depth;
```

---

## 🧩 Quick Summary Table

| Function           | Return Type | Description     | Base Case      | Key Idea               |
| ------------------ | ----------- | --------------- | -------------- | ---------------------- |
| identical          | int         | 두 트리 구조 비교      | 둘 다 NULL       | 좌우 재귀 비교               |
| maxHeight          | int         | 가장 깊은 높이 계산     | NULL → -1      | max(left, right) + 1   |
| countOneChildNodes | int         | 자식 하나인 노드 개수    | NULL → 0       | XOR로 판별                |
| sumOfOddNodes      | int         | 홀수 합 계산         | NULL → 0       | 홀수면 더함                 |
| mirrorTree         | void        | 좌우 반전           | NULL           | swap 후 재귀              |
| printSmallerValues | void        | 특정 값보다 작은 노드 출력 | NULL           | in-order traversal     |
| smallestValue      | int         | 최소값 반환          | NULL → INT_MAX | min(left, right, self) |
| hasGreatGrandchild | int         | 증손자 있는 노드 출력    | NULL → -1      | depth >= 3             |
