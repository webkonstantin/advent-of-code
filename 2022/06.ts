import assert from 'assert';
import get from '../api';

const day = '6';

function prepareInput(input: string) {
    return input.trim();
}

function runA(input: Input) {
    for (let i = 0; i <= input.length - 4; i++) {
        if (new Set(input.slice(i, i + 4)).size === 4) {
            return i + 4;
        }
    }
}

function runB(input: Input) {
    for (let i = 0; i <= input.length - 14; i++) {
        if (new Set(input.slice(i, i + 14)).size === 14) {
            return i + 14;
        }
    }
}

const example = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;
assert.strictEqual(7, runA(prepareInput(example)));
assert.strictEqual(19, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
