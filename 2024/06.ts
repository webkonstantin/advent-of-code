import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(6);

const dirs = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0],
};

const turnCW = (dir: [number, number]) => [-dir[1], dir[0]] as [number, number];

const part1 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  const visited = new Set<string>();

  const go = (x: number, y: number, dir: [number, number]) => {
    while (true) {
      visited.add(`${x},${y}`);
      const [dx, dy] = dir;
      const [nx, ny] = [x + dx, y + dy];
      const c = G[ny]?.[nx];
      if (!c) return;
      if (c === '#') {
        dir = turnCW(dir);
        continue;
      }
      x = nx;
      y = ny;
    }
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = G[y][x];
      if (dirs[c]) {
        go(x, y, dirs[c]);
      }
    }
  }

  return visited.size;
};

assert.equal(part1(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim()), 41);

console.log(part1(input));

const part2 = (input: string) => {
  const G = input.split('\n').map((r) => r.split(''));
  const [W, H] = [G[0].length, G.length];

  const visited = new Set<string>();

  const go = (x: number, y: number, dir: [number, number]) => {
    while (true) {
      visited.add(`${x},${y}`);
      const [dx, dy] = dir;
      const [nx, ny] = [x + dx, y + dy];
      const c = G[ny]?.[nx];
      if (!c) return;
      if (c === '#') {
        dir = turnCW(dir);
        continue;
      }
      x = nx;
      y = ny;
    }
  };

  let start: [number, number];
  let startDir: [number, number];
  start: for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = G[y][x];
      if (dirs[c]) {
        start = [x, y];
        startDir = dirs[c];
        go(x, y, dirs[c]);
        break start;
      }
    }
  }

  const hasCycle = (x: number, y: number, dir: [number, number]) => {
    const visited2 = new Set<string>();
    while (true) {
      const key = `${x},${y},${dir}`;
      if (visited2.has(key)) return true;
      visited2.add(key);
      const [dx, dy] = dir;
      const [nx, ny] = [x + dx, y + dy];
      const c = G[ny]?.[nx];
      if (!c) return;
      if (c === '#') {
        dir = turnCW(dir);
        continue;
      }
      x = nx;
      y = ny;
    }
  };

  let a = 0;
  for (const xy of visited) {
    const [x, y] = xy.split(',').map(Number);
    if ([x, y].toString() === start.toString()) continue;
    G[y][x] = '#';
    if (hasCycle(start[0], start[1], startDir)) a++;
    G[y][x] = '.';
  }

  return a;
};

assert.equal(part2(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim()), 6);

console.log(part2(input));
