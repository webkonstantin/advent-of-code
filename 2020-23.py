import fileinput
from itertools import islice, cycle, chain

inp = [l for l in fileinput.input()][0].strip()
cups = list(map(int, inp))


def make_the_crab_move():
    yield cups[0]
    taken = cups[1:4]
    rest = cups[4:]
    dest = cups[0] - 1
    while True:
        if dest == 0:
            dest = 9
        if dest in rest:
            break
        dest -= 1
    for cup in rest:
        yield cup
        if cup == dest:
            for put_back in taken:
                yield put_back


def rotate(i, n=1):
    return list(islice(cycle(i), n, n + len(cups)))


for _ in range(100):
    cups = rotate(list(make_the_crab_move()))
print(''.join(map(str, rotate(cups, cups.index(1))))[1:])

len_ = 1_000_000
m_cups = chain(map(int, inp), range(10, len_ + 1))
S = {}
HEAD = None
TAIL = HEAD
for i in m_cups:
    next_ = [i, None]
    if HEAD is None:
        TAIL = HEAD = next_
    S[i] = next_
    TAIL[1] = next_
    TAIL = next_
TAIL[1] = HEAD


def iter_head():
    curr = HEAD
    while True:
        yield curr
        curr = curr[1]


def make_the_ultimate_crab_move():
    global HEAD
    head, *taken, next_curr = list(islice(iter_head(), 0, 5))
    head[1] = next_curr

    dest = head[0] - 1
    while True:
        if dest == 0:
            dest = len_
        if dest not in (t[0] for t in taken):
            break
        dest -= 1

    dest_left = S[dest]
    dest_right = dest_left[1]

    dest_left[1] = taken[0]
    taken[2][1] = dest_right

    HEAD = HEAD[1]


for _ in range(10 ** 7):
    make_the_ultimate_crab_move()
one = S[1]
print(one[1][0] * one[1][1][0])
