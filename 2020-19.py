import fileinput
import re

lines = [line.rstrip() for line in fileinput.input()]

msgs = lines[lines.index('') + 1:]
R = {}


def add_rules(rules):
    for rule in rules:
        k, v = rule.split(': ')
        R[int(k)] = v


def get_re(n):
    if n in ['|', '+']:
        return n
    if n[0] == '"':
        return n[1]
    rule = R[int(n)].split(' ')
    r = ['('] + [get_re(c) for c in rule] + [')']
    return ''.join(r)


def matches():
    regex = re.compile(get_re('0'))
    return sum((bool(regex.fullmatch(msg)) for msg in msgs))


add_rules(lines[0:lines.index('')])
print(matches())

add_rules((
    # '8: 42 | 42 8',
    '8: 42 +',
    # '11: 42 31 | 42 11 31',
    '11: 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31',
))
print(matches())
