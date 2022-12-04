import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '4';

function prepareInput(input: string) {
  return splitLines(input).map(line => line.split(',').map(elf => elf.split('-').map(Number)));
}

function runA(input: Input) {
  return input.filter(([a, b]) => {
    if (a[0] > b[0] || (a[0] === b[0] && a[1] < b[1])) [a, b] = [b, a];
    return a[1] >= b[1];
  }).length;
}

function runB(input: Input) {
  return input.filter(([a, b]) => {
    if (a[0] > b[0] || (a[0] === b[0] && a[1] < b[1])) [a, b] = [b, a];
    return a[1] >= b[0];
  }).length;
}

const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

assert.strictEqual(2, runA(prepareInput(example)));
assert.strictEqual(4, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
