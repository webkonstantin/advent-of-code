import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(9);

const part1 = (input: string) => {
  const a = input.split('').map(Number);

  function* go() {
    let r = a.length - 1;
    if (r % 2 === 1) r--;
    while (a[r] === 0) r -= 2;
    const fromRight = () => {
      const val = r / 2;
      a[r] -= 1;
      while (a[r] === 0) r -= 2;
      return val;
    };
    for (let l = 0; l < a.length; l++) {
      for (let i = 0; i < a[l] && l <= r; i++) {
        yield l % 2 === 0 ? l / 2 : fromRight();
      }
    }
  }

  let sum = 0;
  let i = 0;
  for (const id of go()) {
    sum += id * i;
    i++;
  }

  return sum;
};

assert.equal(part1('2333133121414131402'), 1928);

console.log(part1(input));
