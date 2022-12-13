// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '0';

function prepareInput(input: string) {
    return splitLines(input);
}

function runA(input: Input) {
    //
}

function runB(input: Input) {
    //
}

const ex = ``;
assert.strictEqual(0, runA(prepareInput(ex)));
// assert.strictEqual(0, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    // console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
