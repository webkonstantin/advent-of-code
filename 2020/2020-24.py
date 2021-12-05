import fileinput
from itertools import product

lines = [line.rstrip() for line in fileinput.input()]

moves = {
    'e': (1, 0),
    'se': (1, -1),
    'sw': (0, -1),
    'w': (-1, 0),
    'nw': (-1, 1),
    'ne': (0, 1),
}

B = set()  # black
for line in lines:
    x, y = 0, 0
    while line:
        for move, (dx, dy) in moves.items():
            if line.startswith(move):
                line = line[len(move):]
                x += dx
                y += dy
    B ^= {(x, y)}

print(len(B))

for _ in range(100):
    newB = set()
    checked = set()
    for (x, y), (dx, dy) in product(B, moves.values()):
        pos = (x + dx, y + dy)

        if pos in checked:
            continue
        checked.add(pos)

        B_next_door = 0
        for mx, my in moves.values():
            if (pos[0] + mx, pos[1] + my) in B:
                B_next_door += 1
            if B_next_door > 2:
                break

        if pos in B:
            if B_next_door in (1, 2):
                newB.add(pos)
        elif B_next_door == 2:
            newB.add(pos)
    B = newB

print(len(B))
