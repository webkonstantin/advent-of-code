// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { zip } from 'lodash';

const day = '22';

function prepareInput(input: string) {
  return splitLines(input);
}

const dirs = [
  // right
  [0, 1],
  // down
  [1, 0],
  // left
  [0, -1],
  // up
  [-1, 0],
];

const D = ['>', 'v', '<', '^'];

function runA(input: Input) {
  const board = input.slice(0, -1).map(line => line.split(''));
  let path = input[input.length - 1];
  let y = 0;
  let x = 0;
  while (board[0][x] !== '.') x++;
  // board[y][x] = 'X';
  let dir = 0; // right
  // console.log(board.map(row => row.join('')), path);
  // const path =
  // console.log(path);
  // console.log(path.match(/\d+/g), path.match(/\D+/g));
  path = zip(path.match(/\d+/g).map(Number), path.match(/\D+/g));
  path = path.flat().filter(Boolean);
  console.log(path.slice(-3));
  for (const P of path) {
    if (P === 'R') {
      dir = (dir + 1) % 4;
    } else if (P === 'L') {
      dir = (dir + 3) % 4;
    } else if (typeof P === 'number') {
      for (let i = 0; i < P; i++) {
        let ny = (y + dirs[dir][0] + board.length) % board.length;
        let nx = (x + dirs[dir][1] + board[0].length) % board[0].length;
        while ((!board[ny][nx]) || board[ny][nx] === ' ') {
          ny = (ny + dirs[dir][0] + board.length) % board.length;
          nx = (nx + dirs[dir][1] + board[0].length) % board[0].length;
        }
        if (board[ny][nx] === '#') {
          break;
        }
        // board[y][x] = D[dir];
        y = ny;
        x = nx;
      }
    }
  }
  // console.log(board.map(row => row.join('')));
  return 1000 * (y + 1) + 4 * (x + 1) + dir;
}

function runB(input: Input) {
  //
}

const ex = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`;
assert.strictEqual(6032, runA(prepareInput(ex)));
// assert.strictEqual(0, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  // console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
