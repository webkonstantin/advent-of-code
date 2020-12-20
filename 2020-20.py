import fileinput
import itertools
import re
from collections import defaultdict, Counter
from functools import lru_cache
from itertools import islice
from math import sqrt
from random import random

lines = [line.rstrip() for line in fileinput.input()]

tiles = defaultdict(list)
tile_id = None
for line in lines:
    if line.startswith('Tile '):
        tile_id = line[5:-1]
    elif line:
        tiles[tile_id].append(line)


@lru_cache(maxsize=1000)
def get_edges(tid, flip):
    tile = tiles[tid]

    edges = [
        tuple(tile[0]),  # top
        tuple(row[-1] for row in tile),  # r
        tuple(reversed(tile[-1])),  # b
        tuple(reversed([row[0] for row in tile])),  # l
    ]

    if flip:
        edges[1], edges[3] = tuple(reversed(edges[3])), tuple(reversed(edges[1]))
        edges[0] = tuple(reversed(edges[0]))
        edges[2] = tuple(reversed(edges[2]))

    return edges


def get_edge(position, direction):
    tid, flip, rotation = position
    edges = get_edges(tid, flip)
    return edges[(rotation + direction) % len(edges)]


# edges = defaultdict(list)
# for tid, tile in tiles.items():
#     for rot, edge in enumerate(get_edges(tile)):
#         edges[edge].append((tid, rot))
# print(tid, rot, edge)

width = int(sqrt(len(tiles)))
placed = []  # tid, flip, rotation


def is_placed(t_id):
    for p in placed:
        if t_id == p[0]:
            return True


def place():
    if len(placed) == len(tiles):
        return True
    for tid, tile in tiles.items():
        if not is_placed(tid):
            for flip in [False, True]:
                for rotation in range(0, 4):
                    position = (tid, flip, rotation)
                    # print(position, ''.join(get_edge(position, 0)))
                    if can_place(position):  # can place
                        placed.append(position)
                        rec = place()
                        if rec:
                            return rec
                        else:
                            placed.pop()


# BOTTOM = {}
# def memo_neighbors():
#     for tid, tile in tiles.items():
#         for flip in [False, True]:
#             for rotation in range(0, 4):
#                 position = (tid, flip, rotation)


def can_place(position):
    if len(placed) % width:
        left_tile = placed[-1]
        if get_edge(left_tile, 1) != tuple(reversed(get_edge(position, 3))):
            return False

    if len(placed) - width >= 0:
        top_tile = placed[len(placed) - width]
        if get_edge(top_tile, 2) != tuple(reversed(get_edge(position, 0))):
            return False

    return True


def do_rotate(m, rotation=1):
    """
    >>> do_rotate([[1, 2], [3, 4]], 1)
    [(2, 4), (1, 3)]
    """
    for _ in range(rotation):
        m = list(reversed(list(zip(*m))))
    return m


def do_flip(m, flip=False):
    """
    >>> do_flip([[1, 2], [3, 4]], True)
    [(2, 1), (4, 3)]
    """
    if flip:
        return [tuple(reversed(row)) for row in m]
    return m


place()

print(int(placed[0][0]) * int(placed[width-1][0]) * int(placed[-width][0]) * int(placed[-1][0]))

# print("=" * 20)
image = []


def flip_rotate(pos, remove_borders=False):
    tid, flip, rotation = pos
    tile = tiles[tid]
    m = do_rotate(do_flip(tile, flip), rotation)
    return [row[1:-1] for row in m[1:-1]]


flatten = lambda t: [item for sublist in t for item in sublist]

for y in range(width):
    # row = ''
    # print([p[0] for p in placed[y * width:y * width + width]])
    # for p in placed[y * width:y * width + width]:
    #     m = flip_rotate(p)
    #     for r in m:
    #         print(''.join(r))
    #     # for r in m[1:-1]:
    #     #     print(''.join(r[1:-1]))
    #     print()

    for row in zip(*[flip_rotate(p, True) for p in placed[y * width:y * width + width]]):
        # print(''.join(flatten(row)))
        image.append(flatten(row))
        # for rrr in [''.join(c) for c in row]:
        #     print(rrr)

    # print()

# for row in image:
#     print(''.join(row))

img_str = ''.join(''.join(row) for row in image)

# print(img_str)

pattern = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
]

def match(pat_, str_):
    poss = set()
    start = 0
    while start <= len(str_) - len(pat_):
        # print(start, str_[start:])
        search = re.search(pat_, str_[start:])
        # print(search.start())
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
        for i,c in enumerate(pat_):
            if c == '#':
                str_[pos + i] = 'O'
    # print(''.join(str_))
    return str_


for flip, rotation in itertools.product([False, True], range(0, 4)):
    # print(flip, rotation)
    pat = ''
    for row in do_rotate(do_flip(pattern, flip), rotation):
        if pat:
            pat += "." * (len(image) - len(row))
        row = ''.join(row).replace(' ', '.')
        pat += row
        # print(row)
    # print(len(pat), len(image), pat)

    matches = match(pat, img_str)
    if matches:
        print(Counter(matches)['#'])

    # matches = re.finditer(pat, img_str)
    # count = len(list(matches))
    # if count:
    #     print(
    #         Counter(img_str)['#'] - count * Counter(pat)['#']
    #     )

    # print("MATCH", len(list(re.finditer(pat, img_str))))
    # print("MATCH", len(list(re.finditer(pat, img_str))))

# print(match("#..", "######.#######"))

# for tid, tile in tiles.items():
#     # print(tid, tile)
#     M = 0
#     for rot, edge in enumerate(get_edges(tile)):
#         # print(tid, rot, ''.join(edge), ''.join(reversed(edge)))
#         match = tuple(reversed(edge))
#         if match in edges:
#             M += 1
#         match = edge
#         if match in edges:
#             M += 1
#     print(tid, M)
#
# print(len(list(itertools.permutations(range(1, 5)))))

# c = Counter()
# for tile in tiles.values():
#     edges_counts = [edges[edge] for edge in get_edges(tile)]
#     print(edges_counts)
# s = sum(edges_counts)
# c.update([s])
# c.
# print(c)
# if c == 5:

# print()
# print(c)

# for edge in get_edges(tile):
#     edges.add(edge)
# print(len(edges))
# print(get_edges(
#     list(tiles.values())[0]
# ))
# print(len(tiles))

if __name__ == "__main__":
    import doctest

    doctest.testmod()
