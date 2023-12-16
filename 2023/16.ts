import * as assert from 'assert';
import { getInput } from './get-input';
import { range } from 'lodash-es';

type Point = [number, number];

function part1(input: string, startPos: Point = [0, 0], startDir: Point = [1, 0]) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];

    const visited = new Set<string>();
    const seen = new Set<string>();

    const dfs = (pos: Point, dir: Point) => {
        const [x, y] = pos;
        if (x < 0 || x >= W || y < 0 || y >= H) return;
        const [dx, dy] = dir;

        const seenKey = `${x},${y},${dx},${dy}`;
        if (seen.has(seenKey)) return;
        seen.add(seenKey);

        const visitedKey = `${x},${y}`;
        visited.add(visitedKey);

        const axis = dx === 0 ? 'vertical' : 'horizontal' as const;

        const rotate = {
            horizontal: {
                '\\': 'right',
                '/': 'left',
            },
            vertical: {
                '\\': 'left',
                '/': 'right',
            },
        } as const;

        const rotateFns = {
            // 1,0 => 0,1, 0,-1 => 1,0
            right: ([dx, dy]: Point): Point => [-dy, dx],
            // 1,0 => 0,-1, 0,1 => 1,0
            left: ([dx, dy]: Point): Point => [dy, -dx],
        } as const;

        const splits = {
            horizontal: {
                '|': [[0, 1], [0, -1]],
            },
            vertical: {
                '-': [[1, 0], [-1, 0]],
            },
        };

        const c = G[y][x];
        if (c === '.') {
            dfs([x + dx, y + dy], dir);
        } else if (c === '\\' || c === '/') {
            const newDir = rotateFns[rotate[axis][c]](dir);
            dfs([x + newDir[0], y + newDir[1]], newDir);
        } else if (c === '|' || c === '-') {
            if (splits[axis][c]) {
                for (const newDir of splits[axis][c]) {
                    dfs([x + newDir[0], y + newDir[1]], newDir);
                }
            } else {
                dfs([x + dx, y + dy], dir);
            }
        }
    };

    dfs(startPos, startDir);

    return visited.size;
}

function part2(input: string) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];
    const energies = [];
    for (const x of range(W)) {
        energies.push(part1(input, [x, 0], [0, 1]));
        energies.push(part1(input, [x, H - 1], [0, -1]));
    }
    for (const y of range(H)) {
        energies.push(part1(input, [0, y], [1, 0]));
        energies.push(part1(input, [W - 1, y], [-1, 0]));
    }
    return Math.max(...energies);
}

const input = await getInput(16);

const sample = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trim();

assert.equal(part1(sample), 46);
assert.equal(part2(sample), 51);

console.log(part1(input));
console.log(part2(input));
