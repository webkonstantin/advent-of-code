import * as assert from 'assert';
import { getInput } from './get-input';
import { range, sum } from 'lodash-es';

function part1(input: string) {
    console.log(input);
    const lines = input.split('\n');
    const G = lines; //.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];
    console.log({W,H});
    return sum(range(W).map(x => {
        const sections = range(H).map(y => G[y][x]).join('').split('#');
        console.log(sections);
        let top = 0;
        let weight = 0;
        for (const section of sections) {
            const roundRocks = section.split('').filter(c => c === 'O').length;
            for (const i of range(roundRocks)) {
                weight += H - (top + i);
            }
            top += section.length + 1;
        }
        return weight;
    }));
}

function part2(input: string) {
}

const input = await getInput(14);

const sample = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim();

assert.equal(part1(sample), 136);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
