def solution(k, m, score):
    answer = 0
    score.sort(reverse = True)
    if(len(score)//m == 0):
        return 0
    else:
        count = len(score)//m
    score = score[:count*m]
    for i in range(1,count+1):
        answer += score[m*i-1]*m
    return answer
        