import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(7);

const part1 = (input: string) => {
  const lines = input.split('\n');
  let sum = 0;
  for (const line of lines) {
    const [_value, _rest] = line.trim().split(': ');
    const value = Number(_value);
    const nums = _rest.split(' ').map(Number);
    let options = new Set<number>([nums[0]]);
    for (let i = 1; i < nums.length; i++) {
      const n = nums[i];
      const newOptions = new Set<number>();
      for (const option of options) {
        for (const x of [option + n, option * n]) {
          if (x <= value) newOptions.add(x);
        }
      }
      options = newOptions;
    }
    if (options.has(value)) sum += value;
  }
  return sum;
};

assert.equal(part1(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim()), 3749);

console.log(part1(input));

const part2 = (input: string) => {
  const lines = input.split('\n');
  let sum = 0;
  for (const line of lines) {
    const [_value, _rest] = line.trim().split(': ');
    const value = Number(_value);
    const nums = _rest.split(' ').map(Number);
    let options = new Set<number>([nums[0]]);
    for (let i = 1; i < nums.length; i++) {
      const n = nums[i];
      const newOptions = new Set<number>();
      for (const option of options) {
        for (const x of [option + n, option * n, Number(`${option}${n}`)]) {
          if (x <= value) newOptions.add(x);
        }
      }
      options = newOptions;
    }
    if (options.has(value)) sum += value;
  }
  return sum;
};

assert.equal(part2(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim()), 11387);

console.log(part2(input));
