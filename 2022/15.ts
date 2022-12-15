// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { sum } from 'lodash';

const day = '15';

function prepareInput(input: string) {
  return splitLines(input).map(line => line.match(/(-?\d+)/g).map(Number));
}

function runA(input: Input, row = 2000000) {
  const intervals = [];
  for (const [x, y, bx, by] of input) {
    const dist = Math.abs(x - bx) + Math.abs(y - by);
    const distToRow = Math.abs(y - row);
    if (distToRow > dist) continue;
    const rad = dist - distToRow;
    let [l, r] = [x - rad, x + rad];
    if (by === row) {
      if (bx === l) l++;
      else r--;
    }
    if (l > r) continue;
    intervals.push([l, r]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [l, r] of intervals) {
    if (merged.length === 0) merged.push([l, r]);
    else {
      const [ml, mr] = merged[merged.length - 1];
      if (l > mr) merged.push([l, r]);
      else merged[merged.length - 1][1] = Math.max(mr, r);
    }
  }
  return sum(merged.map(([l, r]) => r - l + 1));
}

function runB(input: Input, maxC = 4000000) {
  const check = (x, y) => {
    if (x < 0 || y < 0) return false;
    if (x > maxC || y > maxC) return false;
    return input.every(([sx, sy, bx, by]) => {
      const dist = Math.abs(sx - bx) + Math.abs(sy - by);
      const dist2 = Math.abs(sx - x) + Math.abs(sy - y);
      return dist2 > dist;
    });
  };
  for (const [sx, sy, bx, by] of input) {
    const dist = Math.abs(sx - bx) + Math.abs(sy - by);
    let [x, y] = [sx, sy - dist - 1];
    while (y < sy) {
      if (check(x, y)) return x * 4000000 + y;
      [x, y] = [x + 1, y + 1];
    }
    while (x > sx) {
      if (check(x, y)) return x * 4000000 + y;
      [x, y] = [x - 1, y + 1];
    }
    while (y > sy) {
      if (check(x, y)) return x * 4000000 + y;
      [x, y] = [x - 1, y - 1];
    }
    while (x < sx) {
      if (check(x, y)) return x * 4000000 + y;
      [x, y] = [x + 1, y - 1];
    }
  }
}

const ex = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;
assert.strictEqual(26, runA(prepareInput(ex), 10));
assert.strictEqual(56000011, runB(prepareInput(ex), 20));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
