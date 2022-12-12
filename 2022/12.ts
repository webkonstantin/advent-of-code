// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { Vector2 } from '../types';

const day = '12';

function prepareInput(input: string) {
  return splitLines(input).map(line => line.split(''));
}

function runA(G: Input) {
  const W = G[0].length;
  const H = G.length;
  let S: Vector2 = [0, 0];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (G[y][x] === 'S') {
        S = [x, y];
      }
    }
  }
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let level: Vector2[] = [S];
  const getElevation = ((x, y) => {
    if (G[y][x] === 'S') return 'a';
    if (G[y][x] === 'E') return 'z';
    return G[y][x];
  });
  let visited = new Set();
  visited.add(S.join(','));
  let steps = 0;
  while (level.length) {
    steps++;
    const newLevel: Vector2[] = [];
    for (const [x, y] of level) {
      const elevation = getElevation(x, y);
      for (const [dx, dy] of dirs) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) {
          continue;
        }
        const nextElevation = getElevation(nx, ny);
        if (nextElevation.charCodeAt(0) <= elevation.charCodeAt(0) + 1) {
          if (G[ny][nx] === 'E') {
            return steps;
          }
          const key = [nx, ny].join(',');
          if (!visited.has(key)) {
            visited.add(key);
            newLevel.push([nx, ny]);
          }
        }
      }
    }
    level = newLevel;
  }
}

function runB(G: Input) {
  const W = G[0].length;
  const H = G.length;
  const getElevation = ((x, y) => {
    if (G[y][x] === 'S') return 'a';
    if (G[y][x] === 'E') return 'z';
    return G[y][x];
  });
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let level: Vector2[] = [];
  let visited = new Set();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (getElevation(x, y) === 'a') {
        level.push([x, y]);
        visited.add([x, y].join(','));
      }
    }
  }
  let steps = 0;
  while (level.length) {
    steps++;
    const newLevel: Vector2[] = [];
    for (const [x, y] of level) {
      const elevation = getElevation(x, y);
      for (const [dx, dy] of dirs) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) {
          continue;
        }
        const nextElevation = getElevation(nx, ny);
        if (nextElevation.charCodeAt(0) <= elevation.charCodeAt(0) + 1) {
          if (G[ny][nx] === 'E') {
            return steps;
          }
          const key = [nx, ny].join(',');
          if (!visited.has(key)) {
            visited.add(key);
            newLevel.push([nx, ny]);
          }
        }
      }
    }
    level = newLevel;
  }
}

const ex = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
assert.strictEqual(31, runA(prepareInput(ex)));
assert.strictEqual(29, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
