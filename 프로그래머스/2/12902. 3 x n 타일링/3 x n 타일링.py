def solution(n):
    MOD = 1000000007
    if n % 2 == 1:
        return 0
    
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[2] = 3
    
    for i in range(4, n + 1, 2):
        dp[i] = (4 * dp[i - 2] - dp[i - 4]) % MOD
    return dp[n]
    
    