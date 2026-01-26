---
date: 2025-10-11
tags: [CS]
---



## 1️⃣ Level Order — `levelOrderIterative(BSTNode *root)`

```c
void levelOrderIterative(BSTNode *root) {
    if (root == NULL) return;

    QueueNode *head = NULL, *tail = NULL;   // ✅ 큐 포인터 준비
    enqueue(&head, &tail, root);

    while (!isEmpty(head)) {
        BSTNode *n = dequeue(&head, &tail); // ✅ (&head, &tail)
        printf("%d ", n->item);
	        if (n->left)  enqueue(&head, &tail, n->left);
        if (n->right) enqueue(&head, &tail, n->right);
    }
}
```

---

## 2️⃣ In-order — `inOrderIterative(BSTNode *root)`

```c
void inOrderIterative(BSTNode *root) {
    StackNode *top = NULL;
    BSTNode *curr = root;

    while (curr != NULL || !isEmptyStack(top)) {
        if (curr) {
            push(&top, curr);
            curr = curr->left;
        } else {
            curr = pop(&top);              // ✅ pop(&top)
            printf("%d ", curr->item);
            curr = curr->right;
        }
    }
}
```

---

## 3️⃣ Pre-order — `preOrderIterative(BSTNode *root)`

```c
void preOrderIterative(BSTNode *root) {
    if (root == NULL) return;

    StackNode *top = NULL;
    push(&top, root);

    while (!isEmptyStack(top)) {
        BSTNode *n = pop(&top);
        printf("%d ", n->item);
        if (n->right) push(&top, n->right); // 오른쪽 먼저 push → 왼쪽이 먼저 출력
        if (n->left)  push(&top, n->left);
    }
}
```

---

## 4️⃣ Post-order (1 Stack) — `postOrderIterativeS1(BSTNode *root)`

```c
void postOrderIterativeS1(BSTNode *root) {
    if (root == NULL) return;

    StackNode *top = NULL;
    BSTNode *curr = root, *prev = NULL;

    while (curr != NULL || !isEmptyStack(top)) {
        while (curr) {              // 왼쪽 끝까지
            push(&top, curr);
            curr = curr->left;
        }

        BSTNode *t = peek(top);     // 스택 top만 확인
        if (t->right == NULL || t->right == prev) {
            printf("%d ", t->item); // 오른쪽이 없거나 이미 방문 → 출력
            pop(&top);
            prev = t;
            curr = NULL;
        } else {
            curr = t->right;        // 아직 방문 안 한 오른쪽으로
        }
    }
}
```

---

## 5️⃣ Post-order (2 Stacks) — `postOrderIterativeS2(BSTNode *root)`

```c
void postOrderIterativeS2(BSTNode *root) {
    if (root == NULL) return;

    StackNode *s1 = NULL, *s2 = NULL;
    push(&s1, root);

    while (!isEmptyStack(s1)) {
        BSTNode *n = pop(&s1);
        push(&s2, n);
        if (n->left)  push(&s1, n->left);
        if (n->right) push(&s1, n->right);
    }
    while (!isEmptyStack(s2)) {
        printf("%d ", pop(&s2)->item);
    }
}
```
