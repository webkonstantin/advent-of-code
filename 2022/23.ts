// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import memoize from 'memoizee';
import { range } from 'lodash';

const day = '23';

function prepareInput(input: string) {
  return splitLines(input).map(row => row.split(''));
}

const ep = memoize((x: number, y: number) => ([x, y]));

function* getNeighbors([x, y]) {
  for (const dx of range(-1, 2)) {
    for (const dy of range(-1, 2)) {
      if (dx === 0 && dy === 0) continue;
      yield ep(x + dx, y + dy);
    }
  }
}

function* expandDir([dx, dy]) {
  if (dx === 0) {
    for (const dx of range(-1, 2)) {
      yield [dx, dy];
    }
  } else if (dy === 0) {
    for (const dy of range(-1, 2)) {
      yield [dx, dy];
    }
  }
}

function* dirNeighbors([x, y], dir) {
  for (const [dx, dy] of expandDir(dir)) {
    yield ep(x + dx, y + dy);
  }
}

function runA(input: Input) {
  let E = new Set<[number, number]>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === '#') {
        E.add(ep(x, y));
      }
    }
  }
  // N, S, W, E
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  let startDir = 0;
  for (let round = 0; round < 10; round++) {
    const proposeCount = new Map();
    const moves = new Map();
    for (const e of E) {
      const hasN = [...getNeighbors(e)].some(n => E.has(n));
      if (!hasN) continue;
      for (let d = 0; d < 4; d++) {
        const dir = dirs[(startDir + d) % 4];
        const hasDirN = [...dirNeighbors(e, dir)].some(n => E.has(n));
        if (!hasDirN) {
          const proposedPos = ep(e[0] + dir[0], e[1] + dir[1]);
          proposeCount.set(
            proposedPos,
            (proposeCount.get(proposedPos) || 0) + 1
          );
          moves.set(e, proposedPos);
          break;
        }
      }
    }
    E = new Set([...E.values()].map(e => {
      const proposedPos = moves.get(e);
      if (proposedPos) {
        if (proposeCount.get(proposedPos) === 1) {
          return proposedPos;
        }
      }
      return e;
    }));
    startDir++;
  }
  const minX = Math.min(...[...E.values()].map(([x, y]) => x));
  const maxX = Math.max(...[...E.values()].map(([x, y]) => x));
  const minY = Math.min(...[...E.values()].map(([x, y]) => y));
  const maxY = Math.max(...[...E.values()].map(([x, y]) => y));
  const sq = (maxX - minX + 1) * (maxY - minY + 1);
  return sq - E.size;
}

function runB(input: Input) {
  let E = new Set<[number, number]>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === '#') {
        E.add(ep(x, y));
      }
    }
  }
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  let startDir = 0;
  for (let round = 0; round < Infinity; round++) {
    const proposeCount = new Map();
    const moves = new Map();
    for (const e of E) {
      const hasN = [...getNeighbors(e)].some(n => E.has(n));
      if (!hasN) continue;
      for (let d = 0; d < 4; d++) {
        const dir = dirs[(startDir + d) % 4];
        const hasDirN = [...dirNeighbors(e, dir)].some(n => E.has(n));
        if (!hasDirN) {
          const proposedPos = ep(e[0] + dir[0], e[1] + dir[1]);
          proposeCount.set(
            proposedPos,
            (proposeCount.get(proposedPos) || 0) + 1
          );
          moves.set(e, proposedPos);
          break;
        }
      }
    }
    let moved = 0;
    E = new Set([...E.values()].map(e => {
      const proposedPos = moves.get(e);
      if (proposedPos) {
        if (proposeCount.get(proposedPos) === 1) {
          moved++;
          return proposedPos;
        }
      }
      return e;
    }));
    if (moved === 0) return round + 1;
    startDir++;
  }
}

const ex = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`;
assert.strictEqual(110, runA(prepareInput(ex)));
assert.strictEqual(20, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
