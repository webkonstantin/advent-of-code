import fileinput
import math

lines = [l.rstrip() for l in fileinput.input()]

x, buses = int(lines[0]), lines[1].split(',')

bus1 = [int(b) for b in buses if b != 'x']
waits = []
for b in bus1:
    wait = b - x % b
    waits.append((wait, b))
waits = sorted(waits)
print(waits[0][0] * waits[0][1])


bus2 = [(int(buses[i]), i) for i in range(len(buses)) if buses[i] != 'x']
lcm = 1
ans = 0
for bid, t in bus2:
    while (ans + t) % bid != 0:
        ans += lcm
    lcm = math.lcm(lcm, bid)
print(ans)
