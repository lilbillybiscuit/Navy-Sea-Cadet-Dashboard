n = int(input())
for i in range(n):
    a,b = map(int, input().split())
    print("Case #"+str(i+1)+": ")
    print('..+'+'-+'*(b-1))
    print("..|"+".|"*(b-1))
    for j in range(a-1):
        print('+'+'-+'*(b))
        print("|"+".|"*(b))
    print("+"+"-+"*(b))
