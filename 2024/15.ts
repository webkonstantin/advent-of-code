import { getInput } from './get-input';
import * as assert from 'node:assert';
import { range } from 'es-toolkit';

const input = await getInput(15);

const dirs = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0],
};

const part1 = (input: string) => {
  const [map, _moves] = input.split('\n\n');
  const G = map.split('\n').map((row) => row.split(''));
  const moves = _moves.split('').map((c) => c.trim()).filter(Boolean);
  const [W, H] = [G[0].length, G.length];

  let pos: [number, number];

  find_start: for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (G[y][x] === '@') {
        pos = [x, y];
        G[y][x] = '.';
        break find_start;
      }
    }
  }

  for (const move of moves) {
    const [dx, dy] = dirs[move];
    const [x, y] = pos;
    const [nx, ny] = [x + dx, y + dy];
    if (G[ny][nx] === '.') {
      pos = [nx, ny];
    } else if (G[ny][nx] === 'O') {
      let [ex, ey] = [nx + dx, ny + dy];
      while (G[ey][ex] === 'O') {
        ex += dx; ey += dy;
      }
      if (G[ey][ex] === '.') {
        G[ey][ex] = 'O';
        G[ny][nx] = '.';
        pos = [nx, ny];
      }
    }
  }

  let sum = 0;

  for (const y of range(H)) {
    for (const x of range(W)) {
      if (G[y][x] === 'O') {
        sum += y * 100 + x;
      }
    }
  }

  return sum;
};

assert.equal(part1(`
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`.trim()), 2028);

assert.equal(part1(`
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`.trim()), 10092);

console.log(part1(input));

const part2 = (input: string) => {
  const [map, _moves] = input.split('\n\n');
  const G = map.split('\n').map((row) => row.split('').flatMap((c) => ({
    '.': '..'.split(''),
    'O': '[]'.split(''),
    '@': '@.'.split(''),
    '#': '##'.split(''),
  }[c])));

  const moves = _moves.split('').map((c) => c.trim()).filter(Boolean);
  const [W, H] = [G[0].length, G.length];

  let pos: [number, number];

  find_start: for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (G[y][x] === '@') {
        pos = [x, y];
        G[y][x] = '.';
        break find_start;
      }
    }
  }

  const isBox = (c: string) => ['[', ']'].includes(c);

  const logG = () => {
    const prev = G[pos[1]][pos[0]];
    G[pos[1]][pos[0]] = '@';
    console.log(G.map((row) => row.join('')).join('\n'));
    G[pos[1]][pos[0]] = prev;
  };
  logG();

  const moveBoxes = (xx: number[], y: number, dy: number): boolean => {
    //
  };

  for (const move of moves) {
    const [dx, dy] = dirs[move];
    const [x, y] = pos;
    const [nx, ny] = [x + dx, y + dy];
    if (G[ny][nx] === '.') {
      pos = [nx, ny];
    } else if (isBox(G[ny][nx])) {
      if (dy === 0) {
        let ex = nx + dx;
        while (isBox(G[y][ex])) ex += dx;
        if (G[y][ex] === '.') {
          while (ex !== nx) {
            [G[y][ex], G[y][ex - dx]] = [G[y][ex - dx], G[y][ex]];
            ex -= dx;
          }
          pos = [nx, ny];
        }
      } else {
        if (moveBoxes([nx - Number(G[ny][nx] === ']')], ny, dy)) {
          pos = [nx, ny];
        }
      }
    }

    console.log(move);
    logG();
  }

  let sum = 0;

  for (const y of range(H)) {
    for (const x of range(W)) {
      if (G[y][x] === '[') {
        sum += y * 100 + x;
      }
    }
  }

  return sum;
};

part2(`
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`.trim());

process.exit(0);
// assert.equal(part2(`
// #######
// #...#.#
// #.....#
// #..OO@#
// #..O..#
// #.....#
// #######
//
// <vv<<^^<<^^
// `.trim()), Infinity);

assert.equal(part2(`
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`.trim()), 9021);

console.log(part2(input));
