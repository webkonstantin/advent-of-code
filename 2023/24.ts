import * as assert from 'assert';
import { getInput } from './get-input';

function part1(input: string, from = 200000000000000, to = 400000000000000) {
    const stones = input.split('\n').map(line => {
        const [x, y, z, vx, vy, vz] = line.match(/-?\d+/g).map(Number);
        return [x, y, z, vx, vy, vz];
    });
    // console.log(stones);
    const pairs = stones.map((stone1, i) =>
        stones.slice(i + 1).map(stone2 => [stone1, stone2]),
    ).flat();
    // console.log(pairs);
    let answer = 0;
    for (const [stone1, stone2] of pairs) {
        // find intersection
        const [x1, y1, z1, vx1, vy1, vz1] = stone1;
        // y = ax + b
        const a1 = vy1 / vx1;
        const b1 = y1 - a1 * x1;

        const [x2, y2, z2, vx2, vy2, vz2] = stone2;
        const a2 = vy2 / vx2;
        const b2 = y2 - a2 * x2;

        // a1x + b1 = a2x + b2
        // a1x - a2x = b2 - b1
        // x(a1 - a2) = b2 - b1
        // x = (b2 - b1) / (a1 - a2)
        if (a1 === a2) {
            // console.log([stone1, stone2]);
            if (b1 === b2) {
                // console.log('same line');
                continue;
            }
            // console.log('parallel lines');
            continue;
        }

        // also handle vertical lines?

        const x = (b2 - b1) / (a1 - a2);
        if (x < from || x > to) continue;
        const y = a1 * x + b1;
        if (y < from || y > to) continue;

        // future position
        if (Math.sign(vx1) !== Math.sign(x - x1)) continue;
        if (Math.sign(vy1) !== Math.sign(y - y1)) continue;
        if (Math.sign(vx2) !== Math.sign(x - x2)) continue;
        if (Math.sign(vy2) !== Math.sign(y - y2)) continue;

        answer++;
    }
    return answer;
}

function part2(input: string) {
}

const input = await getInput(24);

const sample = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`.trim();

assert.equal(part1(sample, 7, 27), 2);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
