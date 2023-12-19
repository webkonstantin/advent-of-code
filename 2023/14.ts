import * as assert from 'assert';
import { getInput } from './get-input';
import { range, sum } from 'lodash-es';

function part1(input: string) {
    const G = input.split('\n');
    const [W, H] = [G[0].length, G.length];
    return sum(range(W).map(x => {
        const col = range(H).map(y => G[y][x]).join('');
        const sections = col.split('#');
        let top = 0;
        let load = 0;
        for (const section of sections) {
            const roundRocks = section.split('').filter(c => c === 'O').length;
            for (const i of range(roundRocks)) {
                load += H - (top + i);
            }
            top += section.length + 1;
        }
        return load;
    }));
}

// todo
function part2(input: string) {
    let G = input.split('\n').map(s => s.split(''));
    const rotate90 = (G: string[][]) => G[0].map((_, i) => G.map(row => row[i]).reverse());
    const getLoad = () => {
        const [W, H] = [G[0].length, G.length];
        return sum(range(H).map(y => {
            const row = G[y].join('');
            const sections = row.split('#');
            let left = 0;
            let load = 0;
            for (const section of sections) {
                const roundRocks = section.split('').filter(c => c === 'O').length;
                for (const i of range(roundRocks)) {
                    load += W - (left + i);
                }
                left += section.length + 1;
            }
            return load;
        }));
    };
    const moveLeft = () => {
        G = G.map(row_ => {
            const row = row_.join('');
            const sections = row.split('#');
            return sections.map(section => {
                const roundRocks = section.split('').filter(c => c === 'O').length;
                return 'O'.repeat(roundRocks) + '.'.repeat(section.length - roundRocks);
            }).join('#').split('');
        });
    };

    const seen = new Map<string, {
        i: number;
        load: number;
    }>();
    let i = 0;
    const cycle = () => {
        for (const _ of range(4)) {
            G = rotate90(G);
            moveLeft();
        }
    };
    while (true) {


        const load = getLoad();
        const key = G.map(row => row.join('')).join('');
        if (seen.has(key)) {
            console.log(seen.get(key));
            break;
        }
        seen.set(key, { i, load });
        i++;
    }
    console.log(i);
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
assert.equal(part2(sample), 64);

console.log(part1(input));
console.log(part2(input));
