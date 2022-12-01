import assert from 'assert';
import { sum } from 'lodash';
import get from '../api';

const day = '1';

function prepareInput(input: string) {
    return input.split('\n\n').map((group) => group.split('\n').map(Number));
}

function runA(input: Input) {
    return Math.max(...input.map((group) => sum(group)));
}

function runB(input: Input) {
    return sum(
        input.map((group) => sum(group)).sort((a, b) => b - a).slice(0, 3)
    );
}

const example = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
assert.strictEqual(24000, runA(prepareInput(example)));
assert.strictEqual(45000, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
