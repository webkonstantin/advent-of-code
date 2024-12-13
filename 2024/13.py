# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "sympy",
# ]
# ///

from sympy.solvers import solve
from sympy import Symbol, Rational
import re

def parse_machine(machine_str):
    lines = machine_str.strip().split('\n')
    numbers = [list(map(int, re.findall(r'\d+', line))) for line in lines]
    return numbers[0], numbers[1], numbers[2]

def solve_machine(a_moves, b_moves, target, p2 = False):
    a = Symbol('a', integer=True)
    b = Symbol('b', integer=True)

    solutions = solve((
        a * a_moves[0] + b * b_moves[0] - (target[0] + 10000000000000 * p2),
        a * a_moves[1] + b * b_moves[1] - (target[1] + 10000000000000 * p2)
    ), (a, b))

    if not solutions:
        return 0

    min_tokens = float('inf')

    if not isinstance(solutions, list):
        solutions = [solutions]

    for sol in solutions:
        if isinstance(sol, dict):
            a_presses = sol[a]
            b_presses = sol[b]
        else:
            continue

        if (isinstance(a_presses, (int, Rational)) and isinstance(b_presses, (int, Rational)) and
            a_presses.is_integer and b_presses.is_integer and
            a_presses >= 0 and b_presses >= 0):
            tokens = 3 * int(a_presses) + int(b_presses)
            min_tokens = min(min_tokens, tokens)

    return 0 if min_tokens == float('inf') else min_tokens

def part1(input_str):
    machines = input_str.strip().split('\n\n')
    total_tokens = 0

    for machine in machines:
        a_moves, b_moves, target = parse_machine(machine)
        tokens = solve_machine(a_moves, b_moves, target)
        total_tokens += tokens

    return total_tokens

def part2(input_str):
    machines = input_str.strip().split('\n\n')
    total_tokens = 0

    for machine in machines:
        a_moves, b_moves, target = parse_machine(machine)
        tokens = solve_machine(a_moves, b_moves, target, p2 = True)
        total_tokens += tokens

    return total_tokens

test_input = """
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
""".strip()

assert part1(test_input) == 480

with open('inputs/13.txt', 'r') as f:
    input_data = f.read()

print(part1(input_data))
print(part2(input_data))
