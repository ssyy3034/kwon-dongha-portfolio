from collections import Counter

answer = Counter(input().upper())
top = answer.most_common(2)

if len(top) > 1 and top[0][1] == top[1][1]:
    print("?")
else:
    print(top[0][0])
