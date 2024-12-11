import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(11);

const part1 = (input: string, times = 25) => {
  let a = input.split(' ').map(n => parseInt(n, 10));
  for (let i = 0; i < times; i++) {
    const b = [];
    for (const n of a) {
      if (n === 0) {
        b.push(1);
      } else if (n.toString().length % 2 === 0) {
        const s = n.toString();
        const half = s.length / 2;
        b.push(parseInt(s.slice(0, half), 10));
        b.push(parseInt(s.slice(half), 10));
      } else {
        b.push(n * 2024);
      }
    }
    a = b;
  }
  return a.length;
};

function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const memo = new Map<string, ReturnType<T>>();
  return function (...args: any[]) {
    const key = JSON.stringify(args);
    if (memo.has(key)) return memo.get(key);
    const result = fn(...args);
    memo.set(key, result);
    return result;
  } as T;
}

const getNumber = memoize((n: number, times: number): number => {
  if (times === 0) {
    return 1;
  }
  if (n === 0) {
    return getNumber(1, times - 1);
  }
  if (n.toString().length % 2 === 0) {
    const s = n.toString();
    const half = s.length / 2;
    const left = parseInt(s.slice(0, half), 10);
    const right = parseInt(s.slice(half), 10);
    return getNumber(left, times - 1) + getNumber(right, times - 1);
  }
  return getNumber(n * 2024, times - 1);
});

const part2 = (input: string, times = 75) => {
  return input
    .split(' ')
    .map(n => parseInt(n, 10))
    .map(n => getNumber(n, times))
    .reduce((a, b) => a + b, 0);
};

assert.equal(part1(`125 17`, 6), 22);
assert.equal(part1(`125 17`, 25), 55312);

assert.equal(part2(`125 17`, 6), 22);
assert.equal(part2(`125 17`, 25), 55312);

console.log(part1(input));
console.log(part2(input));
