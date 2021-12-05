import fileinput

lines = [l.rstrip() for l in fileinput.input()]

# x, y = 0, 0
x, y = 0, 0
# dx, dy = 1, 0  # facing east
wx, wy = 10, 1

for line in lines:
    action, num = line[:1], int(line[1:])
    # print((action, num))
    if action == 'N':
        wy = wy + num
        # y = y + num
    if action == 'S':
        wy = wy - num
        # y = y - num
    if action == 'E':
        wx = wx + num
        # x = x + num
    if action == 'W':
        wx = wx - num
        # x = x - num
    if action == 'L':
        while num > 0:
            wx, wy = -wy, wx
            # dx, dy = -dy, dx
            num = num - 90

    if action == 'R':
        while num > 0:
            wx, wy = wy, -wx
            num = num - 90

    if action == 'F':
        while num > 0:
            x = x + wx
            y = y + wy
            num = num - 1

    # print(line, x, y)

print(x, y, abs(x) + abs(y))
