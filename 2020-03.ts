import get from './api';
import { splitLines } from './utils';
import assert from 'assert';

function runA(data: string, r: number = 3, d: number = 1) {
    const f = splitLines(data);
    let [x, y] = [0, 0];
    let trees = 0;
    while (y < f.length) {
        if (f[y][x % f[0].length] === '#') trees++;
        [x, y] = [x + r, y + d];
    }
    return trees;
}

function runB(data: string) {
    return (
        runA(data, 1, 1) *
        runA(data, 3, 1) *
        runA(data, 5, 1) *
        runA(data, 7, 1) *
        runA(data, 1, 2)
    );
}

assert.equal(7, runA(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`));

assert.equal(336, runB(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`));

const run = async () => {
    const data = await get('2020/day/3/input');

    console.log(runA(data));
    console.log(runB(data));
};

if (require.main === module) {
    run();
}
