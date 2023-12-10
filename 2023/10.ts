import * as assert from 'assert';
import { getInput } from './get-input';

/*

    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
    . is ground; there is no pipe in this tile.
    S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

*/

const PIPES = {
    '|': 'NS',
    '-': 'EW',
    L: 'NE',
    J: 'NW',
    7: 'SW',
    F: 'SE',
    S: 'NSEW',
};

const DIRS = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0],
};

const OPPOSITE = {
    N: 'S',
    S: 'N',
    E: 'W',
    W: 'E',
};

const adj = ([x, y]: [number, number]) => Object.values(DIRS).map(([dx, dy]) => [x + dx, y + dy]);

function part1(input: string) {
    const G = input.split('\n').map(s => s.split(''));
    const [W, H] = [G[0].length, G.length];
    let S = [0, 0] as [number, number];
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            if (G[y][x] === 'S') {
                S = [x, y];
            }
        }
    }
    const inBounds = ([x, y]: [number, number]) => x >= 0 && x < W && y >= 0 && y < H;
    console.log(S);

    function* getNextConnected([x, y]: [number, number]) {
        const pipe = G[y][x];
        for (const dir of PIPES[pipe]) {
            const [dx, dy] = DIRS[dir];
            const [nx, ny] = [x + dx, y + dy];
            if (inBounds([nx, ny])) {
                const nextPipe = G[ny][nx];
                if (nextPipe === '.') continue;
                const nextDirs = PIPES[nextPipe];
                if (nextDirs.includes(OPPOSITE[dir])) {
                    yield [nx, ny];
                }
            }
        }

    };
    let level = [S];
    let i = 0;
    const seen = new Set<string>();
    while (true) {
        i++;
        console.log(i, level);
        if (level.length === 0) throw new Error('no path');
        const newLevel = [];
        for (const p of level) {
            for (const next of getNextConnected(p)) {
                if (G[next[1]][next[0]] === 'S') {
                    // return Math.floor(i / 2); // 012210
                }
                if (seen.has(next.toString())) continue;
                seen.add(next.toString());
                newLevel.push(next);
            }
        }
        level = newLevel;
    }
}

function part2(input: string) {
    //
}

const input = await getInput(10);

const sample = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim();

assert.equal(part1(sample), 8);
// assert.equal(part2(sample), 2);

// console.log(part1(input));
// console.log(part2(input));
