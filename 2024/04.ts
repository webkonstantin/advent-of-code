import { getInput } from './get-input';
import * as assert from 'assert';

const input = await getInput(4);

const WORD = 'XMAS';

const part1 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];

  let sum = 0;

  const checkWord = (x: number, y: number, dx: number, dy: number, i: number) => {
    if (G[y][x] !== WORD[i]) return;
    if (i === WORD.length - 1) {
      sum++;
      return;
    }
    const [nx, ny] = [x + dx, y + dy];
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) return;
    checkWord(nx, ny, dx, dy, i + 1);
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          checkWord(x, y, dx, dy, 0);
        }
      }
    }
  }

  return sum;
};

const part2 = (input: string) => {
  const G = input.split('\n');
  const [W, H] = [G[0].length, G.length];
  let sum = 0;

  for (let y = 0; y < H - 2; y++) {
    for (let x = 0; x < W - 2; x++) {
      const mas1 = G[y][x] + G[y + 1][x + 1] + G[y + 2][x + 2];
      const mas2 = G[y][x + 2] + G[y + 1][x + 1] + G[y + 2][x];
      if (
        [mas1, mas1.split('').reverse().join('')].includes('MAS') &&
        [mas2, mas2.split('').reverse().join('')].includes('MAS')
      ) sum++;
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

assert.equal(part2(`
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
`.trim()), 9);

console.log(part2(input));
