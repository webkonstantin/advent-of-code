// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '18';

function prepareInput(input: string) {
  return splitLines(input).map(line => line.split(',').map(Number));
}

function runA(input: Input) {
  let sum = 0;
  const S = new Set();
  for (const C of input) {
    sum += 6;
    S.add(C.join(','));
    for (let i = 0; i < 3; i++) {
      const N = [...C];
      N[i] += 1;
      if (S.has(N.join(','))) sum -= 2;
      N[i] -= 2;
      if (S.has(N.join(','))) sum -= 2;
    }
  }
  return sum;
}

function runB(input: Input) {
  //
}

const ex = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`;
assert.strictEqual(64, runA(prepareInput(ex)));
// assert.strictEqual(0, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  // console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
