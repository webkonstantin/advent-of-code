import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { range } from 'lodash';

const day = '9';

function prepareInput(input: string) {
    return splitLines(input).map(line => line.split(' ')).map(([dir, l]) => ([dir, Number(l)] as const));
}

function runA(input: Input) {
    const visited = new Set();
    const H = [0,0];
    const T = [0,0];
    for (let [dir, l] of input) {
        while (l--) {
            switch (dir) {
                case 'R': H[0]++; break;
                case 'U': H[1]++; break;
                case 'L': H[0]--; break;
                case 'D': H[1]--; break;
            }
            if (Math.max(Math.abs(H[0] - T[0]), Math.abs(H[1] - T[1])) > 1) {
                T[0] += Math.sign(H[0] - T[0]);
                T[1] += Math.sign(H[1] - T[1]);
            }
            visited.add(T.join(','));
        }
    }
    return visited.size;
}

function runB(input: Input) {
    const visited = new Set();
    const K = range(0, 10).map(() => [0,0]);
    const H = K[0];
    const T = K[9];
    for (let [dir, l] of input) {
        while (l--) {
            switch (dir) {
                case 'R': H[0]++; break;
                case 'U': H[1]++; break;
                case 'L': H[0]--; break;
                case 'D': H[1]--; break;
            }
            K.reduce((H, T) => {
                if (Math.max(Math.abs(H[0] - T[0]), Math.abs(H[1] - T[1])) > 1) {
                    T[0] += Math.sign(H[0] - T[0]);
                    T[1] += Math.sign(H[1] - T[1]);
                }
                return T;
            });
            visited.add(T.join(','));
        }
    }
    return visited.size;
}

const ex = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;
assert.strictEqual(13, runA(prepareInput(ex)));
assert.strictEqual(1, runB(prepareInput(ex)));
const ex2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;
assert.strictEqual(36, runB(prepareInput(ex2)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
