def solution(wallpaper):

    rows = []
    cols = []
    for i in range(len(wallpaper)):
        for j in range(len(wallpaper[i])):
            if wallpaper[i][j] == "#":
                rows.append(i)
                cols.append(j)
    return [min(rows),min(cols),max(rows)+1,max(cols) + 1]
                

            
    return answer