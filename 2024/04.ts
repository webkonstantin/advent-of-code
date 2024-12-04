import { getInput } from './get-input';
import * as assert from 'assert';

const input = await getInput(4);

const WORD = 'XMAS';

const part1 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  let sum = 0;

  const visited = Array.from({ length: H }, () => Array.from({ length: W }, () => false));

  const dfs = (x: number, y: number, dx: number, dy: number, i: number) => {
    const c = G[y][x];
    if (c !== WORD[i]) return;
    if (i === WORD.length - 1) {
      // visited[y][x] = true;
      // console.log(visited.map((row, y) => row.map((v, x) => v ? G[y][x] : '.').join('')).join('\n')+ '\n');
      // visited[y][x] = false;
      sum++;
      return;
    }
    const [nx, ny] = [x + dx, y + dy];
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) return;
    if (visited[ny][nx]) return;
    visited[y][x] = true;
    dfs(nx, ny, dx, dy, i + 1);
    visited[y][x] = false;
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          dfs(x, y, dx, dy, 0);
        }
      }
    }
  }


  return sum;
};

assert.equal(part1(`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim()), 18);

console.log(part1(input));
