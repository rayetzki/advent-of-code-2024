program = list(map(int, "2,4,1,1,7,5,1,5,4,3,0,3,5,5,3,0".split(',')))

def findA(program, result):
  if program == []: return result
  for t in range(8):
    A = result << 3 | t
    B = A % 8
    B = B ^ 1
    C = A >> B
    B = B ^ 5
    B = B ^ C
    if B % 8 == program[-1]:
      sub = findA(program[:-1], A)
      if sub is None: continue
      return sub
    
print(findA(program, 0))