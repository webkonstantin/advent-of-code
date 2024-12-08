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
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  const visited = new Set<string>();
  const obstacles = new Set<string>();

  let start: [number, number];

  const go = (x: number, y: number, dir: [number, number]) => {
    while (true) {
      visited.add(`${x},${y},${dir}`);
      const [dx, dy] = dir;
      const [nx, ny] = [x + dx, y + dy];
      const c = G[ny]?.[nx];
      if (!c) return;
      if (c === '#') {
        dir = turnCW(dir);
        continue;
      } else if ([nx, ny].toString() !== start.toString()) {
        // check what if it was #
        const [tx, ty] = turnCW(dir);
        const [ntx, nty] = [x + tx, y + ty];
        if (visited.has(`${ntx},${nty},${[tx, ty]}`)) {
          obstacles.add(`${nx},${ny}`);
        }
      }
      x = nx;
      y = ny;
    }
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = G[y][x];
      if (dirs[c]) {
        start = [x, y];
        go(x, y, dirs[c]);
      }
    }
  }

  console.log(obstacles);

  return obstacles.size;
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
