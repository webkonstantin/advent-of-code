import { getInput } from './get-input';
import * as assert from 'node:assert';
import { ints } from './utils';

const input = await getInput(13);

const part1 = (input: string) => {
  const machines = input.split('\n\n').map((machine) => {
    const [a, b, p] = machine.split('\n').map((line) => ints(line));
    return [a, b, p];
  });
  return machines.map(([a, b, p]) => {
    let minTokens = Infinity;
    for (let aPresses = 0; aPresses <= 100; aPresses++) {
      const x = a[0] * aPresses;
      const xLeft = p[0] - x;
      if (xLeft % b[0] === 0) {
        const bPresses = xLeft / b[0];
        const y = a[1] * aPresses + b[1] * bPresses;
        if (y === p[1]) {
          const tokens = aPresses * 3 + bPresses;
          if (tokens < minTokens) {
            minTokens = tokens;
          }
        }
      }
    }
    return minTokens === Infinity ? 0 : minTokens;
  }).reduce((acc, tokens) => acc + tokens, 0);
};

assert.equal(part1(`
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
`.trim()), 480);

console.log(part1(input));
