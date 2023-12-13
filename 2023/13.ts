import * as assert from 'assert';
import { getInput } from './get-input';
import { range, sum } from 'lodash-es';

function part1(input: string) {
    const patterns = input.split('\n\n');
    return sum(patterns.map(pattern => {
        const G = pattern.split('\n');
        const [W, H] = [G[0].length, G.length];
        const isColReflection = (x: number) => {
            let [l, r] = [x, x + 1];
            while (l >= 0 && r < W) {
                if (!range(H).every(y => G[y][l] === G[y][r])) return false;
                l--; r++;
            }
            return true;
        };
        const isRowReflection = (y: number) => {
            let [t, b] = [y, y + 1];
            while (t >= 0 && b < H) {
                if (!range(W).every(x => G[t][x] === G[b][x])) return false;
                t--; b++;
            }
            return true;
        };
        for (const x of range(W - 1)) {
            if (isColReflection(x)) return x + 1;
        }
        for (const y of range(H - 1)) {
            if (isRowReflection(y)) return (y + 1) * 100;
        }
    }));
}

function part2(input: string) {
    const patterns = input.split('\n\n');
    return sum(patterns.map(pattern => {
        const G = pattern.split('\n');
        const [W, H] = [G[0].length, G.length];
        const isColReflection = (x: number) => {
            let mismatches = 0;
            let [l, r] = [x, x + 1];
            while (l >= 0 && r < W && mismatches <= 1) {
                mismatches += range(H).filter(y => G[y][l] !== G[y][r]).length;
                l--; r++;
            }
            return mismatches === 1;
        };
        const isRowReflection = (y: number) => {
            let mismatches = 0;
            let [t, b] = [y, y + 1];
            while (t >= 0 && b < H && mismatches <= 1) {
                mismatches += range(W).filter(x => G[t][x] !== G[b][x]).length;
                t--; b++;
            }
            return mismatches === 1;
        }
        for (const x of range(W - 1)) {
            if (isColReflection(x)) return x + 1;
        }
        for (const y of range(H - 1)) {
            if (isRowReflection(y)) return (y + 1) * 100;
        }
    }));
}

const input = await getInput(13);

const sample = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`.trim();

assert.equal(part1(sample), 405);
assert.equal(part2(sample), 400);

console.log(part1(input));
console.log(part2(input));
