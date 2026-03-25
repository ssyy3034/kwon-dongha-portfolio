N = int(input())
word_list = []
for _ in range(N):
    word_list.append(input())
count = 0

for word in word_list:
    exist_alpha = []
    is_check = False
    prev = ''
    for alpha in word:
        if len(word) == 1:
            break
        if prev != alpha and alpha in exist_alpha:
            is_check = True
            break
        else:
            exist_alpha.append(alpha)
            prev = alpha
    if not is_check:
        count+=1
print(count)

