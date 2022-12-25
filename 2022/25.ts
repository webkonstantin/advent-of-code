// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '25';

function prepareInput(input: string) {
  return splitLines(input);
}

const D = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

function toDec(S: string) {
  return S.split('')
    .map((c, i) => D[c] * 5 ** (S.length - i - 1))
    .reduce((a, b) => a + b);
}

function toSNAFU(N: number) {
  const res = [];
  while (N !== 0) {
    let length = 1;
    while (1) {
      const d = Object.keys(D).reverse().find(d => {
        const max = toDec(d + '2'.repeat(length - 1));
        const min = toDec(d + '='.repeat(length - 1));
        return N >= min && N <= max;
      });
      if (d) {
        res.push({ length, d });
        N -= toDec(d.padEnd(length, '0'));
        break;
      }
      length++;
    }
  }
  const a = new Array(res[0].length).fill('0');
  for (const { length, d } of res) {
    a[length - 1] = d;
  }
  return a.reverse().join('');
}

const digits = [ '=', '-', '0', '1', '2' ];

function toSNAFU2(N: number) {
  const res = [];
  while (N !== 0) {
    res.push(digits[(N + 2) % 5]);
    N = Math.floor((N + 2) / 5);
  }
  return res.reverse().join('');
}

function runA(input: Input) {
  // console.log(toSNAFU2(1));
  // console.log(toSNAFU2(2));
  // console.log(toSNAFU2(3));
  // console.log(toSNAFU2(4));
  // console.log(toSNAFU2(5));
  // console.log(toSNAFU2(6));
  // console.log(toSNAFU2(2022));
  return toSNAFU2(input.map(toDec).reduce((a, b) => a + b));
}

function runB(input: Input) {
  //
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
