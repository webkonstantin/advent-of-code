import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(16);

function findCell(G: string[][], s: string): [number, number] {
  for (let y = 0; y < G.length; y++) {
    for (let x = 0; x < G[y].length; x++) {
      if (G[y][x] === s) {
        return [x, y];
      }
    }
  }
}

function printGrid(G: string[][], cell = (x: number, y: number, val: string) => G[y][x]) {
  console.log(G.map((row, y) => row
    .map((_, x) => cell(x, y, G[y][x]))
    .join('')).join('\n'));
}

const dirs = [
  [0, -1], // up
  [1, 0], // right
  [0, 1], // down
  [-1, 0], // left
];

const turnCW = (dir: number) => (dir + 1) % 4;
const turnCCW = (dir: number) => (dir + 3) % 4;

function moveDir([x, y]: [number, number], dir: number): [number, number] {
  const [dx, dy] = dirs[dir];
  return [x + dx, y + dy];
}

const part1 = (input: string) => {
  const G = input.split('\n').map((row) => row.split(''));
  const start = findCell(G, 'S');
  const end = findCell(G, 'E');
  const visited = new Set<string>();
  const minScores = new Map<string, number>();
  let minScore = Infinity;
  const go = ([x, y] = start, dir = 1, score = 0) => {
    const minScoreHere = minScores.get(`${x},${y},${dir}`);
    if (minScoreHere !== undefined && minScoreHere <= score) return;
    minScores.set(`${x},${y},${dir}`, score);
    if (score >= minScore) return;
    const key = `${x},${y}`;
    if (visited.has(key)) return;
    const c = G[y][x];
    if (c === '#') return;
    if (c === 'E') {
      if (score < minScore) minScore = score;
      return;
    }
    visited.add(key);
    go(moveDir([x, y], dir), dir, score + 1);
    const cwDir = turnCW(dir);
    go(moveDir([x, y], cwDir), cwDir, score + 1001);
    const ccwDir = turnCCW(dir);
    go(moveDir([x, y], ccwDir), ccwDir, score + 1001);
    visited.delete(key);
  };
  go();
  return minScore;
};

assert.equal(part1(`
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim()), 7036);

assert.equal(part1(`
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`.trim()), 11048);

// console.debug('part1: Tests pass');

console.log(part1(input));
