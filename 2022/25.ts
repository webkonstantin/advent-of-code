// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '25';

function prepareInput(input: string) {
  return splitLines(input);
}

const digits = [ '=', '-', '0', '1', '2' ];

function toDec(S: string) {
  let [p, res] = [1, 0];
  for (let i = S.length - 1; i >= 0; i--) {
    res += p * (digits.indexOf(S[i]) - 2);
    p *= 5;
  }
  return res;
}

function toSNAFU(N: number) {
  const res = [];
  while (N !== 0) {
    N += 2;
    res.push(digits[N % 5]);
    N = Math.floor(N / 5);
  }
  return res.reverse().join('');
}

function runA(input: Input) {
  return toSNAFU(input.map(toDec).reduce((a, b) => a + b));
}

const ex = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;
assert.strictEqual('2=-1=0', runA(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
