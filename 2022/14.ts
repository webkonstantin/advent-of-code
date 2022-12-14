// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import memoize from 'memoizee';

const day = '14';

function prepareInput(input: string) {
  return splitLines(input);
}

const mp = memoize((x, y) => ([x, y]));

function runA(input: Input) {
  const rocks = new Set();
  let maxY = 0;
  for (const line of input) {
    const points = line.split(' -> ').map((p) => mp(...p.split(',').map(Number)));
    maxY = Math.max(maxY, ...points.map((p) => p[1]));
    let pos = points[0];
    for (let i = 1; i < points.length; i++) {
      const next = points[i];
      while (pos !== next) {
        rocks.add(pos);
        pos = mp(pos[0] + Math.sign(next[0] - pos[0]), pos[1] + Math.sign(next[1] - pos[1]));
      }
      rocks.add(pos);
    }
  }
  let total = 0;
  while (true) {
    let sand = mp(500, 0);
    while (true) {
      if (sand[1] > maxY) break;
      if (!rocks.has(mp(sand[0], sand[1] + 1))) {
        sand = mp(sand[0], sand[1] + 1);
        continue;
      } else if (!rocks.has(mp(sand[0] - 1, sand[1] + 1))) {
        sand = mp(sand[0] - 1, sand[1] + 1);
        continue;
      } else if (!rocks.has(mp(sand[0] + 1, sand[1] + 1))) {
        sand = mp(sand[0] + 1, sand[1] + 1);
        continue;
      }
      total++;
      rocks.add(sand);
      break;
    }
    if (sand[1] > maxY) break;
  }
  return total;
}

function runB(input: Input) {
  const rocks = new Set();
  let maxY = 0;
  for (const line of input) {
    const points = line.split(' -> ').map((p) => mp(...p.split(',').map(Number)));
    maxY = Math.max(maxY, ...points.map((p) => p[1]));
    let pos = points[0];
    for (let i = 1; i < points.length; i++) {
      const next = points[i];
      while (pos !== next) {
        rocks.add(pos);
        pos = mp(pos[0] + Math.sign(next[0] - pos[0]), pos[1] + Math.sign(next[1] - pos[1]));
      }
      rocks.add(pos);
    }
  }
  let total = 0;
  while (true) {
    let sand = mp(500, 0);
    while (true) {
      if (sand[1] > maxY) {
        total++;
        rocks.add(sand);
        break;
      }
      if (!rocks.has(mp(sand[0], sand[1] + 1))) {
        sand = mp(sand[0], sand[1] + 1);
        continue;
      } else if (!rocks.has(mp(sand[0] - 1, sand[1] + 1))) {
        sand = mp(sand[0] - 1, sand[1] + 1);
        continue;
      } else if (!rocks.has(mp(sand[0] + 1, sand[1] + 1))) {
        sand = mp(sand[0] + 1, sand[1] + 1);
        continue;
      }
      total++;
      rocks.add(sand);
      break;
    }
    if (sand === mp(500, 0)) break;
  }
  return total;
}

const ex = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;
assert.strictEqual(24, runA(prepareInput(ex)));
assert.strictEqual(93, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
