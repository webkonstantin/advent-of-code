import assert from 'assert';
import get from '../api';
import { sum } from 'lodash';

const day = '7';

function prepareInput(input: string) {
    return input.split(',').map(Number);
}

function runA(input: Input) {
    let min = Infinity;
    for (let i = Math.min(...input); i <= Math.max(...input); i++) {
        const n = sum(input.map(x => Math.abs(x - i)));
        min = Math.min(min, n);
    }
    return min
}

function runB(input: Input) {
    let min = Infinity;
    for (let i = Math.min(...input); i <= Math.max(...input); i++) {
        const n = sum(input.map(x => {
            return ((Math.abs(x - i) + 1) * Math.abs(x - i)) / 2;
        }));
        min = Math.min(min, n);
    }
    return min
}

assert.strictEqual(37, runA(prepareInput(`16,1,2,0,4,2,7,1,2,14`)));
assert.strictEqual(168, runB(prepareInput(`16,1,2,0,4,2,7,1,2,14`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
