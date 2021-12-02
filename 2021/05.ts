import get from '../api';
import { splitLines } from '../utils';
import assert from 'assert';

const day = '5';

function prepareInput(input: string) {
    return splitLines(input).map(l => l.split(' -> ').map(s => s.split(',').map(Number)));
}


function runA(input: Input) {
    const m: Record<string, number> = {};
    for (const [a, b] of input) {
        const [x1, y1] = a;
        const [x2, y2] = b;
        if (!(x1 === x2 || y1 === y2)) {
            continue;
        }
        const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        const dir = [(x2 - x1) / len, (y2 - y1) / len];
        for (let i = 0; i <= len; i++) {
            const [x, y] = [x1 + i * dir[0], y1 + i * dir[1]];
            const k = `${x},${y}`;
            m[k] = (m[k] || 0) + 1;
        }
    }
    return Object.values(m).filter(v => v > 1).length;
}

function runB(input: Input) {
    const m: Record<string, number> = {};
    for (const [a, b] of input) {
        const [x1, y1] = a;
        const [x2, y2] = b;
        const len = (x1 === x2 || y1 === y2)
            ? Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
            : Math.abs(x2 - x1);
        const dir = [(x2 - x1) / len, (y2 - y1) / len];
        for (let i = 0; i <= len; i++) {
            const [x, y] = [x1 + i * dir[0], y1 + i * dir[1]];
            const k = `${x},${y}`;
            m[k] = (m[k] || 0) + 1;
        }
    }
    return Object.values(m).filter(v => v > 1).length;
}

assert.strictEqual(5, runA(prepareInput(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`)));

assert.strictEqual(12, runB(prepareInput(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
