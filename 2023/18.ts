import * as assert from 'assert';
import { getInput } from './get-input';
import memo from 'memoizee';
import { range } from 'lodash-es';

type Point = [number, number];

const DIRS = {
    R: [1, 0] as Point,
    D: [0, 1] as Point,
    L: [-1, 0] as Point,
    U: [0, -1] as Point,
};

const p = memo((x: number, y: number) => [x, y] as Point);

function part1(input: string) {
    const lines = input.split('\n').map(line => line.match(/(\w) (\d+) \((.*)\)/));
    let pos = p(0, 0);
    const visited = new Set<Point>([pos]);
    for (const [, dir, dist, color] of lines) {
        // console.log(dir, dist, color);
        let [x, y] = pos;
        const [dx, dy] = DIRS[dir];
        const steps = Number(dist);
        for (let i = 0; i < steps; i++) {
            x += dx;
            y += dy;
            visited.add(p(x, y));
        }
        pos = p(x, y);
    }
    const [minX, minY, maxX, maxY] = [...visited].reduce(([minX, minY, maxX, maxY], [x, y]) => [
        Math.min(minX, x),
        Math.min(minY, y),
        Math.max(maxX, x),
        Math.max(maxY, y),
    ], [Infinity, Infinity, -Infinity, -Infinity]);
    // console.log(range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => visited.has(p(x, y)) ? '#' : '.').join('')).join('\n'));
    console.log({minX, minY, maxX, maxY}, visited.size);

    for (const startX of range(minX, maxX + 1)) {
        for (const startY of range(minY, maxY + 1)) {
            const start = p(startX, startY);
            if (visited.has(start)) continue;
            // console.log(start);
            const queue = [start];
            const seen = new Set<Point>([start]);
            let touchEdge = false;
            while (queue.length) {
                const pos = queue.shift()!;
                if (pos[0] === minX || pos[0] === maxX || pos[1] === minY || pos[1] === maxY) {
                    touchEdge = true;
                    break;
                }
                for (const [dx, dy] of Object.values(DIRS)) {
                    const newPos = p(pos[0] + dx, pos[1] + dy);
                    if (visited.has(newPos) || seen.has(newPos)) continue;
                    seen.add(newPos);
                    queue.push(newPos);
                }
            }
            if (!touchEdge) {
                console.log(start);
                return seen.size + visited.size;
            }
        }
    }
}

// todo
function part2(input: string) {
}

const input = await getInput(18);

const sample = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`.trim();

assert.equal(part1(sample), 62);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
