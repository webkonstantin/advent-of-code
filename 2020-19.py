import fileinput
import re
from functools import lru_cache

lines = [line.rstrip() for line in fileinput.input()]

msgs = lines[lines.index('') + 1:]
R = {}


def add_rules(rules):
    go.cache_clear()
    for rule in rules:
        k, v = rule.split(': ')
        R[int(k)] = v


@lru_cache
def go(n):
    if n in ['|', '+']:
        return n
    if n[0] == '"':
        return n[1]
    s = R[int(n)].split(' ')
    r = ['(']
    for c in s:
        r += go(c)
    r += [')']
    return ''.join(r)


def matches():
    regex = re.compile('^' + go('0') + '$')
    return sum([bool(regex.match(msg)) for msg in msgs])


add_rules(lines[0:lines.index('')])
print(matches())

add_rules([
    # '8: 42 | 42 8',
    '8: 42 +',
    # '11: 42 31 | 42 11 31',
    '11: 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31',
])
print(matches())
