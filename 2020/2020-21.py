import fileinput
from collections import defaultdict
from itertools import product, groupby

lines = [line.rstrip() for line in fileinput.input()]

I = defaultdict(set)
II = []
A = defaultdict(set)
AA = []
for i, line in enumerate(lines):
    ingredients, allergens = line.split(' (contains ')
    ingredients = ingredients.split(' ')
    allergens = allergens[:-1].split(', ')
    II.append(ingredients)
    AA.append(allergens)
    for ii in ingredients:
        I[ii].add(i)
    for aa in allergens:
        A[aa].add(i)
    # print(ingredients, allergens)


def can_contain(ing, al):
    for i in A[al]:
        if not ing in II[i]:
            return False
    return True


F = set()
ALL = []
CAN = defaultdict(set)
for ing in I.keys():
    for al in A.keys():
        if can_contain(ing, al):
            ALL.append((ing, al))
            CAN[ing].add(al)
            F.add(ing)
CAN = dict(CAN)
# print(CAN)

ans = 0
for empty in I.keys() - F:
    ans += len(I[empty])
print(ans)

SOLVED = {}  # ing: al

# print("=" * 40)

# print([A[al] for al in A])
CAN_AL = {}
for al in A:
    CAN_AL[al] = set.intersection(*[set(II[i]) for i in A[al]])

while len(CAN_AL):
    # print(CAN, CAN_AL)
    for ing, al in SOLVED.items():
        # if ing in CAN:
        #     del CAN[ing]
        if al in CAN_AL:
            del CAN_AL[al]
    # for ing in CAN:
    #     rest = CAN[ing] - set(SOLVED.values())
    #     if len(rest) == 1:
    #         SOLVED[ing] = list(rest)[0]
    for al in CAN_AL:
        rest = CAN_AL[al] - set(SOLVED.keys())
        # print(al, rest)
        if len(rest) == 1:
            SOLVED[list(rest)[0]] = al

# print(SOLVED)
print(','.join([t[1] for t in sorted(list(zip(SOLVED.values(), SOLVED.keys())))]))


# while len(CAN) or len(CAN_AL):
#     print(CAN, CAN_AL)
#     print(SOLVED)
#     for ing, al in SOLVED.items():
#         if ing in CAN:
#             del CAN[ing]
#         if al in CAN_AL:
#             del CAN_AL[al]
#     for ing in CAN:
#         rest = CAN[ing] - set(SOLVED.values())
#         if len(rest) == 1:
#             SOLVED[ing] = list(rest)[0]
#     for al in CAN_AL:
#         rest = CAN_AL[al] - set(SOLVED.keys())
#         print(al, rest)
#         if len(rest) == 1:
#             SOLVED[list(rest)[0]] = al
#
# mapValues?


# print(A.keys())

# dir(ALL)
# print(ALL)
# print(CAN)

# print()

# DONE = {}
# ANS = []
# while len(CAN):
#     for ing, als in CAN.items():
#         if len(als) == 1:
#             DONE[ing] = als.pop()
#             del CAN[ing]

# print(ing, list(als))
# print(list(groupby(ALL)))
