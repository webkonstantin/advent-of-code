import fileinput
import math
import re
from copy import copy

lines = [l.rstrip() for l in fileinput.input()]

mask = None
mem = {}
for line in lines:
    if line.startswith('mask'):
        mask = line[-36:]
    else:
        m = re.fullmatch(r"mem\[(\d+)] = (\d+)", line)
        address, value = map(int, m.groups())
        value = "{0:036b}".format(value)
        value = list(value)
        for i, bit in enumerate(mask):
            if bit != 'X':
                value[i] = bit
        value = ''.join(value)
        mem[address] = int(value, 2)
print(sum(mem.values()))

mask = None
mem = {}
for line in lines:
    if line.startswith('mask'):
        mask = line[-36:]
    else:
        m = re.fullmatch(r"mem\[(\d+)] = (\d+)", line)
        address, value = map(int, m.groups())
        address = "{0:036b}".format(address)
        address = list(address)
        for i, bit in enumerate(mask):
            if bit != '0':
                address[i] = bit

        addresses = []
        floating = address.count('X')
        for p in range(int(math.pow(2, floating))):
            P = f"{{0:0{floating}b}}".format(p)
            i = 0
            A = copy(address)
            for j in range(len(A)):
                if A[j] == 'X':
                    A[j] = P[i]
                    i += 1
            A = ''.join(A)
            mem[int(A, 2)] = value


print(sum(mem.values()))
