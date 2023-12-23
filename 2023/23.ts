import * as assert from 'assert';
import { getInput } from './get-input';

type Point = [number, number];

const DIRS = {
    '>': [1, 0] as Point,
    '<': [-1, 0] as Point,
    '^': [0, -1] as Point,
    'v': [0, 1] as Point,
};
const ALL_DIRS = Object.values(DIRS);

function part1(input: string) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];

    const startX = lines[0].indexOf('.');

    let maxDist = 0;
    const visited = new Set<string>();

    const dfs = (x: number, y: number) => {
        if (x < 0 || x >= W || y < 0 || y >= H) return;
        const val = G[y][x];
        if (val === '#') return;

        if (y === H - 1) {
            maxDist = Math.max(maxDist, visited.size);
            return;
        }

        const key = `${x},${y}`;
        if (visited.has(key)) return;
        visited.add(key);

        const dirs = val in DIRS ? [DIRS[val]] : ALL_DIRS;
        for (const [dx, dy] of dirs) {
            const [nx, ny] = [x + dx, y + dy];
            dfs(nx, ny);
        }

        visited.delete(key);
    };
    dfs(startX, 0);
    return maxDist;
}

function part2(input: string) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];

    const startX = lines[0].indexOf('.');

    let maxDist = 0;
    const visited = new Set<string>();

    const dfs = (x: number, y: number) => {
        if (x < 0 || x >= W || y < 0 || y >= H) return;
        const val = G[y][x];
        if (val === '#') return;

        if (y === H - 1) {
            maxDist = Math.max(maxDist, visited.size);
            return;
        }

        // if (visited.size > 3000) return;
        // console.log(visited.size);
        const key = `${x},${y}`;
        if (visited.has(key)) return;
        visited.add(key);

        const dirs = val in DIRS ? [DIRS[val]] : ALL_DIRS;
        for (const [dx, dy] of ALL_DIRS) {
            const [nx, ny] = [x + dx, y + dy];
            dfs(nx, ny);
        }

        visited.delete(key);
    };
    dfs(startX, 0);
    return maxDist;
}

const input = await getInput(23);

const sample = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`.trim();

assert.equal(part1(sample), 94);
assert.equal(part2(sample), 154);

console.log(part1(input));
console.log(part2(input));
