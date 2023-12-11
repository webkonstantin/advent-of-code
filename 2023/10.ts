import * as assert from 'assert';
import { getInput } from './get-input';
import { sum, zip } from 'lodash-es';
import memo from 'memoizee';

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
    // S: 'NSEW',
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

// const adj = ([x, y]: [number, number]) => Object.values(DIRS).map(([dx, dy]) => [x + dx, y + dy]);

type Point = [number, number];

function part1(input: string) {
    const G = input.split('\n').map(s => s.split(''));
    const [W, H] = [G[0].length, G.length];
    let S = [0, 0] as Point;
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            if (G[y][x] === 'S') {
                S = [x, y];
            }
        }
    }
    const inBounds = ([x, y]: Point) => x >= 0 && x < W && y >= 0 && y < H;
    // console.log(S);
    for (let dir in DIRS) {
        let [x, y] = S;
        let i = 0;
        while (true) {
            i++;
            const [dx, dy] = DIRS[dir];
            x += dx;
            y += dy;
            if (!inBounds([x, y])) break;
            const pipe = G[y][x];
            if (pipe === 'S') {
                return Math.floor(i / 2);
            }
            const newDirs = PIPES[pipe] || '';
            if (!newDirs.includes(OPPOSITE[dir])) break;
            dir = newDirs.replace(OPPOSITE[dir], '');
        }
    }

    // function* getNextConnected([x, y]: [number, number]) {
    //     const pipe = G[y][x];
    //     for (const dir of PIPES[pipe]) {
    //         const [dx, dy] = DIRS[dir];
    //         const [nx, ny] = [x + dx, y + dy];
    //         if (inBounds([nx, ny])) {
    //             const nextPipe = G[ny][nx];
    //             if (nextPipe === '.') continue;
    //             const nextDirs = PIPES[nextPipe];
    //             if (nextDirs.includes(OPPOSITE[dir])) {
    //                 yield [nx, ny];
    //             }
    //         }
    //     }
    //
    // };
    // let level = [S];
    // let i = 0;
    // const seen = new Set<string>();
    // while (true) {
    //     i++;
    //     console.log(i, level);
    //     if (level.length === 0) throw new Error('no path');
    //     const newLevel = [];
    //     for (const p of level) {
    //         for (const next of getNextConnected(p)) {
    //             if (G[next[1]][next[0]] === 'S') {
    //                 // return Math.floor(i / 2); // 012210
    //             }
    //             if (seen.has(next.toString())) continue;
    //             seen.add(next.toString());
    //             newLevel.push(next);
    //         }
    //     }
    //     level = newLevel;
    // }
}

const mp = memo((x: number, y: number) => [x, y]);

function part2(input: string) {
    const G = input.split('\n').map(s => s.split(''));
    const [W, H] = [G[0].length, G.length];
    let S = [0, 0] as Point;
    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            if (G[y][x] === 'S') {
                S = [x, y];
            }
        }
    }
    const inBounds = ([x, y]: Point) => x >= 0 && x < W && y >= 0 && y < H;
    // N: [0, -1] => E: [1, 0]
    const rotateR = ([dx, dy]: Point): Point => [-dy, dx];
    // N: [0, -1] => W: [-1, 0]
    const rotateL = ([dx, dy]: Point): Point => [dy, -dx];
    const sumVectors = <T extends number[]>(...args: T[]) => zip(...args).map(sum) as T;

    const getLoop = function () {
        for (let dir in DIRS) {
            let [x, y] = S;
            const loop: Point[] = [];
            const R: Point[] = [];
            const L: Point[] = [];
            while (true) {
                const [dx, dy] = DIRS[dir];
                x += dx;
                y += dy;
                if (!inBounds([x, y])) break;

                loop.push([x, y]);
                L.push(sumVectors(
                    [x - dx, y - dy] as Point,
                    rotateL([dx, dy]),
                ));
                L.push(sumVectors(
                    [x, y] as Point,
                    rotateL([dx, dy]),
                ));
                R.push(sumVectors(
                    [x - dx, y - dy] as Point,
                    rotateR([dx, dy]),
                ));
                R.push(sumVectors(
                    [x, y] as Point,
                    rotateR([dx, dy]),
                ));

                const pipe = G[y][x];
                if (pipe === 'S') {
                    const notInLoop = ([x, y]) => !loop.some(([x2, y2]) => x === x2 && y === y2);
                    return {
                        loop,
                        R: R.filter(notInLoop),
                        L: L.filter(notInLoop),
                    };
                }
                const newDirs = PIPES[pipe] || '';
                if (!newDirs.includes(OPPOSITE[dir])) break;
                dir = newDirs.replace(OPPOSITE[dir], '');
            }
        }
    };
    const { loop, R, L } = getLoop();
    const count = (points: Point[]) => {
        let visited = new Set<string>();
        const queue = [...points];
        let inbound = true;
        while (queue.length) {
            const [x, y] = queue.pop();
            const key = mp(x, y).toString();
            if (visited.has(key)) continue;
            visited.add(key);
            for (const [dx, dy] of Object.values(DIRS)) {
                const [nx, ny] = [x + dx, y + dy];
                if (inBounds([nx, ny])) {
                    if (!loop.some(([x2, y2]) => x2 === nx && y2 === ny)) {
                        queue.push([nx, ny]);
                    }
                } else {
                    inbound = false;
                }
            }
        }
        return [visited.size, inbound];
    };
    // console.log(loop, R, L);
    for (const points of [R, L]) {
        const [size, inbound] = count(points);
        // console.log(size, inbound);
        if (inbound) {
            return size;
        }
    }
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
assert.equal(part2(`
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim()), 10);

console.log(part1(input));
console.log(part2(input));
