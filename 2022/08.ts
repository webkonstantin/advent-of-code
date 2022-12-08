import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { range } from 'lodash';

const day = '8';

function prepareInput(input: string) {
    return splitLines(input).map((line) => line.split('').map(Number));
}

function runA(input: Input) {
    const visible = new Set();
    const w = input[0].length;
    const h = input.length;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            const val = input[y][x];
            const top = range(0, y).map((y) => input[y][x]);
            const bottom = range(y + 1, h).map((y) => input[y][x]);
            const left = range(0, x).map((x) => input[y][x]);
            const right = range(x + 1, w).map((x) => input[y][x]);
            const sides = [top, bottom, left, right];
            if (sides.some(side => Math.max(...side) < val)) {
                visible.add(`${x},${y}`);
            }
        }
    }
    return visible.size;
}

function runB(input: Input) {
    const w = input[0].length;
    const h = input.length;
    let max = -1;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            const val = input[y][x];
            const top = range(0, y).reverse().map((y) => input[y][x]);
            const bottom = range(y + 1, h).map((y) => input[y][x]);
            const left = range(0, x).reverse().map((x) => input[y][x]);
            const right = range(x + 1, w).map((x) => input[y][x]);
            const sides = [top, bottom, left, right];
            const m = sides.map(side => {
                let visible = 0;
                while (visible < side.length) {
                    visible++;
                    if (side[visible - 1] >= val) {
                        break;
                    }
                }
                return visible;
            });
            const score = m.reduce((a, b) => a * b, 1);
            if (score > max) {
                max = score;
            }
        }
    }
    return max;
}

const example = `30373
25512
65332
33549
35390
`;
assert.strictEqual(21, runA(prepareInput(example)));
assert.strictEqual(8, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
