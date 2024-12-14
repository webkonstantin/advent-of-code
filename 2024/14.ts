import { getInput } from './get-input';
import * as assert from 'node:assert';
import { ints } from './utils';

const input = await getInput(14);

const part1 = (input: string, W = 101, H = 103) => {
  const [mx, my] = [(W - 1) / 2, (H - 1) / 2];
  const q = {} as Record<string, number>;
  for (const line of input.split('\n')) {
    const [x, y, vx, vy] = ints(line);
    const [nx, ny] = [
      (((x + vx * 100) % W) + W) % W,
      (((y + vy * 100) % H) + H) % H,
    ];
    if (nx === mx || ny === my) continue;
    const qk = `${nx > mx},${ny > my}`;
    q[qk] = (q[qk] || 0) + 1;
  }
  return Object.values(q).reduce((a, b) => a * b, 1);
};

const testInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.trim();

assert.equal(part1(testInput, 11, 7), 12);

console.log(part1(input));

const part2 = async (input: string, W = 101, H = 103) => {
  const r = input.split('\n').map((line) => ints(line));
  // for (let i = 0;; i++) {
  for (let i = 57;; i += (160 - 57)) {
    const G = Array.from({ length: H }, (_, y) => Array.from({ length: W }, () => '.')) as string[][];
    for (const [x, y, vx, vy] of r) {
      const [nx, ny] = [
        (((x + vx * i) % W) + W) % W,
        (((y + vy * i) % H) + H) % H,
      ];
      G[ny][nx] = '#';
    }
    console.log(i);
    console.log(G.map((row) => row.join('')).join('\n'));
    await new Promise((r) => setTimeout(r, 100));
  }
};

await part2(input);
