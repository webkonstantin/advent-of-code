import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(8);

const part1 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  const A = {} as Record<string, [number, number][]>;
  const anti = new Set();

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = G[y][x];
      if (c === '.') continue;
      for (const [px, py] of (A[c] || [])) {
        const [dx, dy] = [x - px, y - py];
        for (const [nx, ny] of [[x + dx, y + dy], [px - dx, py - dy]]) {
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            anti.add(`${nx},${ny}`);
          }
        }
      }
      (A[c] ||= []).push([x, y]);
    }
  }

  return anti.size;
};

assert.equal(part1(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`.trim()), 14);

console.log(part1(input));

const part2 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  const A = {} as Record<string, [number, number][]>;
  const anti = new Set();

  function* go(x: number, y: number, dx: number, dy: number) {
    while (x >= 0 && x < W && y >= 0 && y < H) {
      yield [x, y];
      x += dx;
      y += dy;
    }
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = G[y][x];
      if (c === '.') continue;
      for (const [px, py] of (A[c] || [])) {
        const [dx, dy] = [x - px, y - py];
        for (const [nx, ny] of go(x, y, dx, dy)) {
          anti.add(`${nx},${ny}`);
        }
        for (const [nx, ny] of go(x, y, -dx, -dy)) {
          anti.add(`${nx},${ny}`);
        }
      }
      (A[c] ||= []).push([x, y]);
    }
  }

  return anti.size;
};

assert.equal(part2(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`.trim()), 34);

console.log(part2(input));
