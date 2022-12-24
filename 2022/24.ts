// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import memoize from 'memoizee';

const day = '24';

function prepareInput(input: string) {
  return splitLines(input).map((line) => line.split(''));
}

const p = memoize((x, y) => ([x, y]));

const moves = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, 0],
];

const hasBlizzards = (input: Input, nx: number, ny: number, t: number) => {
  const W = input[0].length;
  const H = input.length;
  // check right and left
  const WW = W - 2;
  const xr = ((nx - 1) + t) % WW + 1;
  if (input[ny][xr] === '<') return true;
  const xl = (((nx - 1) - t) % WW + WW) % WW + 1;
  if (input[ny][xl] === '>') return true;
  // check up and down
  const HH = H - 2;
  const yd = ((ny - 1) + t) % HH + 1;
  if (input[yd][nx] === '^') return true;
  const yu = (((ny - 1) - t) % HH + HH) % HH + 1;
  if (input[yu][nx] === 'v') return true;
  return false;
};

function runA(input: Input) {
  const W = input[0].length;
  const H = input.length;

  let t = 0;
  const start = p(1, 0);
  const end = p(W - 2, H - 1);

  let level = new Set([start]);
  while (1) {
    t++;
    const newLevel = new Set();
    for (const [x, y] of level.values()) {
      for (const move of moves) {
        const [dx, dy] = move;
        const [nx, ny] = [x + dx, y + dy];
        const next = p(nx, ny);

        if (next === end) return t;

        if (newLevel.has(next)) continue;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        if (input[ny][nx] === '#') continue;
        if (hasBlizzards(input, nx, ny, t)) continue;

        newLevel.add(next);
      }
    }
    level = newLevel;
  }
}

function runB(input: Input) {
  const W = input[0].length;
  const H = input.length;

  let t = 0;
  const start = p(1, 0);
  const end = p(W - 2, H - 1);

  function go(start, end) {
    let level = new Set([start]);
    while (1) {
      t++;
      const newLevel = new Set();
      for (const [x, y] of level.values()) {
        for (const move of moves) {
          const [dx, dy] = move;
          const [nx, ny] = [x + dx, y + dy];
          const next = p(nx, ny);

          if (next === end) return t;

          if (newLevel.has(next)) continue;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          if (input[ny][nx] === '#') continue;
          if (hasBlizzards(input, nx, ny, t)) continue;

          newLevel.add(next);
        }
      }
      level = newLevel;
    }
  }

  go(start, end);
  go(end, start);
  go(start, end);

  return t;
}

const ex = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`;
assert.strictEqual(18, runA(prepareInput(ex)));
assert.strictEqual(54, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
