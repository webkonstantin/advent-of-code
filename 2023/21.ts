import * as assert from 'assert';
import { getInput } from './get-input';
import { range } from 'lodash-es';
import memo from 'memoizee';

type Point = [number, number];

const p = memo((x: number, y: number) => [x, y] as Point);

function part1(input: string, steps = 64) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];

    let start: Point;
    for (const x of range(W)) {
        for (const y of range(H)) {
            if (G[y][x] === 'S') {
                start = p(x, y);
            }
        }
    }

    let level = new Set([start]);
    while (steps--) {
        const newLevel = new Set<Point>();
        for (const [x, y] of level) {
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const [nx, ny] = [x + dx, y + dy];
                if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
                if (['.', 'S'].includes(G[ny][nx])) {
                    newLevel.add(p(nx, ny));
                }
            }
        }
        level = newLevel;
    }
    return level.size;
}

function part2(input: string, steps = 64) {}

const input = await getInput(21);

const sample = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`.trim();

assert.equal(part1(sample, 6), 16);
// assert.equal(part2(sample, 5000), 16733044);

console.log(part1(input));
// console.log(part2(input));
