import fileinput
from itertools import count, islice

pk1, pk2 = [int(line.rstrip()) for line in fileinput.input()]

mod = 20201227


def get_loop_size(pk):
    val = 1
    for ls in islice(count(), 1, None):
        val *= 7
        val %= mod
        if val == pk:
            return ls


def transform(sub, ls):
    val = 1
    for _ in range(ls):
        val *= sub
        val %= mod
    return val


print(transform(pk2, get_loop_size(pk1)))
