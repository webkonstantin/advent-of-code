// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { sum } from 'lodash';

const day = '20';

function prepareInput(input: string) {
  return splitLines(input).map(n => ({ n: parseInt(n, 10) }));
}

function runA(input: Input) {
  for (const N of [...input]) {
    let i = input.indexOf(N);
    let j = i + N.n;
    j = (j % (input.length - 1) + (input.length - 1)) % (input.length - 1);
    if (j === 0) j = input.length - 1;
    while (i < j) {
      [input[i], input[i + 1]] = [input[i + 1], input[i]];
      i++;
    }
    while (i > j) {
      [input[i], input[i - 1]] = [input[i - 1], input[i]];
      i--;
    }
  }
  const z = input.findIndex(n => n.n === 0);
  return sum([1000, 2000, 3000].map(i => input[(i + z) % input.length].n));
}

function runB(input: Input) {
  input.forEach(N => N.n *= 811589153)
  const O = [...input];
  for (let m = 0; m < 10; m++) {
    for (const N of O) {
      let i = input.indexOf(N);
      let j = i + N.n;
      j = (j % (input.length - 1) + (input.length - 1)) % (input.length - 1);
      if (j === 0) j = input.length - 1;
      while (i < j) {
        [input[i], input[i + 1]] = [input[i + 1], input[i]];
        i++;
      }
      while (i > j) {
        [input[i], input[i - 1]] = [input[i - 1], input[i]];
        i--;
      }
    }
  }
  const z = input.findIndex(n => n.n === 0);
  return sum([1000, 2000, 3000].map(i => input[(i + z) % input.length].n));
}

const ex = `1
2
-3
3
-2
0
4
`;
assert.strictEqual(3, runA(prepareInput(ex)));
assert.strictEqual(1623178306, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
