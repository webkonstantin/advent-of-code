import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(12);

const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const part1 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  let sum = 0;
  const visited = new Set<string>();

  function go(x: number, y: number): number {
    let p = 0;
    if (visited.has(`${x},${y}`)) return 0;
    const c = G[y]?.[x];
    if (!c) return 0;
    visited.add(`${x},${y}`);
    for (const [dx, dy] of dirs) {
      const [nx, ny] = [x + dx, y + dy];
      const nc = G[ny]?.[nx];
      if (nc === c) {
        p += go(nx, ny);
      } else {
        p++;
      }
    }
    return p;
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let prevVisited = visited.size;
      const perimeter = go(x, y);
      const area = visited.size - prevVisited;
      sum += area * perimeter;
    }
  }

  return sum;
};

assert.equal(part1(`
AAAA
BBCD
BBCC
EEEC
`.trim()), 140);

console.log(part1(input));
