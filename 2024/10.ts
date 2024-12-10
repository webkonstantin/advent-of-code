import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(10);

const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

const part1 = (input: string) => {
  const G = input.split('\n').map((line) => line.split('').map(n => parseInt(n, 10)));
  const [W, H] = [G[0].length, G.length];

  let reached = new Set<string>();

  function go(x: number, y: number) {
    const n = G[y][x];
    if (n === 9) {
      reached.add(`${x},${y}`);
      return;
    }
    for (const [dx, dy] of dirs) {
      const [nx, ny] = [x + dx, y + dy];
      const nn = G[ny]?.[nx];
      if (nn === n + 1) go(x + dx, y + dy);
    }
  }

  let sum = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (G[y][x] === 0) {
        reached = new Set<string>();
        go(x, y);
        sum += reached.size;
      }
    }
  }

  return sum;
};

assert.equal(part1(`
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`.trim()), 2);

assert.equal(part1(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim()), 36);

console.log(part1(input));

const part2 = (input: string) => {
  const G = input.split('\n').map((line) => line.split('').map(n => parseInt(n, 10)));
  const [W, H] = [G[0].length, G.length];

  let sum = 0;

  function go(x: number, y: number) {
    const n = G[y][x];
    if (n === 9) {
      sum++;
      return;
    }
    for (const [dx, dy] of dirs) {
      const [nx, ny] = [x + dx, y + dy];
      const nn = G[ny]?.[nx];
      if (nn === n + 1) go(x + dx, y + dy);
    }
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (G[y][x] === 0) {
        go(x, y);
      }
    }
  }

  return sum;
};

assert.equal(part2(`
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`.trim()), 2);

assert.equal(part2(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim()), 81);

console.log(part2(input));
