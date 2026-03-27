from bisect import bisect_right
N,C = map(int,input().split())
arr = list(map(int,input().split()))

mid = len(arr)//2
arrA = arr[:mid]
arrB = arr[mid:]

def make_sum(index, current_sum, source, result_list):
    # 모든 물건을 다 확인했을 때
    if index == len(source):
        result_list.append(current_sum)
        return

    # 1. 현재 물건을 포함하는 경우
    make_sum(index + 1, current_sum + source[index], source, result_list)

    # 2. 현재 물건을 포함하지 않는 경우
    make_sum(index + 1, current_sum, source, result_list)

# 사용법
sumA = []
make_sum(0, 0, arrA, sumA)

sumB = []
make_sum(0, 0, arrB, sumB)

sumB.sort()
answer = 0
for a in sumA:
    if a<=C:
        answer += bisect_right(sumB,C-a)

print(answer)
