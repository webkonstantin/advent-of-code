from collections import defaultdict
from math import sqrt
import fileinput
import itertools
import re

lines = [line.rstrip() for line in fileinput.input()]

tiles = defaultdict(list)
tile_id = None
for line in lines:
    if line.startswith('Tile '):
        tile_id = line[5:-1]
    elif line:
        tiles[tile_id].append(line)


def get_edges(tid, flip):
    tile = tiles[tid]
    edges = [
        tile[0],  # top
        [row[-1] for row in tile],  # r
        tile[-1][::-1],  # b
        [row[0] for row in tile][::-1],  # l
    ]
    if flip:
        edges[1], edges[3] = edges[3][::-1], edges[1][::-1]
        edges[0] = edges[0][::-1]
        edges[2] = edges[2][::-1]
    return edges


def get_edge(position, direction):
    tid, flip, rotation = position
    edges = get_edges(tid, flip)
    return tuple(edges[(rotation + direction) % len(edges)])


TOP_EDGES = defaultdict(set)
LEFT_EDGES = defaultdict(set)
for tid, tile in tiles.items():
    for flip, rotation in itertools.product([False, True], range(0, 4)):
        pos = (tid, flip, rotation)
        TOP_EDGES[get_edge(pos, 0)].add(pos)
        LEFT_EDGES[get_edge(pos, 3)].add(pos)

width = int(sqrt(len(tiles)))
placed = []  # (tid, flip, rotation)


def tiles_can_place():
    set_ = None

    if len(placed) % width:
        left_tile = placed[-1]
        set_ = LEFT_EDGES[get_edge(left_tile, 1)[::-1]]

    if len(placed) - width >= 0:
        top_tile = placed[len(placed) - width]
        top_set = TOP_EDGES[get_edge(top_tile, 2)[::-1]]
        set_ = set_ & top_set if set_ else top_set

    if set_:
        for pos in set_:
            if not pos[0] in next(zip(*placed)):
                yield pos
        return

    for tid, tile in tiles.items():
        if not tid in (p[0] for p in placed):
            for flip, rotation in itertools.product([False, True], range(0, 4)):
                position = (tid, flip, rotation)
                yield position


def place():
    if len(placed) == len(tiles):
        return True
    for position in tiles_can_place():
        placed.append(position)
        if place():
            return True
        else:
            placed.pop()


def do_rotate(m, rotation=1):
    for _ in range(rotation):
        m = list(zip(*m))[::-1]
    return m


def do_flip(m, flip=False):
    if flip:
        return [tuple(row[::-1]) for row in m]
    return m


place()

# for y in range(width):
#     print([p[0] for p in placed[y * width:y * width + width]])

print(int(placed[0][0]) * int(placed[width - 1][0]) * int(placed[-width][0]) * int(placed[-1][0]))

image = []


def flip_rotate(pos):
    tid, flip, rotation = pos
    tile = tiles[tid]
    m = do_rotate(do_flip(tile, flip), rotation)
    return [row[1:-1] for row in m[1:-1]]


flatten = lambda t: [item for sublist in t for item in sublist]

for y in range(width):
    for row in zip(*[flip_rotate(p) for p in placed[y * width:y * width + width]]):
        image.append(flatten(row))

img_str = ''.join(''.join(row) for row in image)
pattern = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
]


def match(pat_, str_):
    poss = set()
    start = 0
    while start <= len(str_) - len(pat_):
        search = re.search(pat_, str_[start:])
        if search:
            start += search.start()
            poss.add(start)
            start += 1
        else:
            break
    if not len(poss):
        return False
    str_ = list(str_)
    for pos in poss:
        for i, c in enumerate(pat_):
            if c == '#':
                str_[pos + i] = 'O'
    return str_


for flip, rotation in itertools.product([False, True], range(0, 4)):
    pat = ''
    for row in do_rotate(do_flip(pattern, flip), rotation):
        if pat:
            pat += "." * (len(image) - len(row))
        row = ''.join(row).replace(' ', '.')
        pat += row

    matches = match(pat, img_str)
    if matches:
        print(matches.count('#'))
