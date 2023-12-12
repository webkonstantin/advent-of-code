import * as assert from 'assert';
import { getInput } from './get-input';
import { range } from 'lodash-es';

function part1(input: string, m = 2) {
    const G = input.split('\n').map((line) => line.split(''));
    const [W, H] = [G[0].length, G.length];
    const galaxies = [];
    const emptyCols = new Set(range(W));
    const emptyRows = new Set(range(H));
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            if (G[y][x] === '#') {
                galaxies.push([x, y]);
                emptyCols.delete(x);
                emptyRows.delete(y);
            }
        }
    }
    let sum = 0;
    for (let i of range(galaxies.length)) {
        for (let j of range(i + 1, galaxies.length)) {
            let [x1, y1] = galaxies[i];
            let [x2, y2] = galaxies[j];
            if (x1 > x2) [x1, x2] = [x2, x1];
            if (y1 > y2) [y1, y2] = [y2, y1];
            sum += x2 - x1 + y2 - y1;
            // sum += range(x1, x2).filter((x) => emptyCols.has(x)).length * (m - 1);
            // sum += range(y1, y2).filter((y) => emptyRows.has(y)).length * (m - 1);
            sum += [...emptyCols.keys()].filter(col => col > x1 && col < x2).length * (m - 1);
            sum += [...emptyRows.keys()].filter(row => row > y1 && row < y2).length * (m - 1);
        }
    }
    return sum;
}

const input = await getInput(11);

const sample = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();

assert.equal(part1(sample), 374);
assert.equal(part1(sample, 100), 8410);

console.log(part1(input));
console.log(part1(input, 1000000));
