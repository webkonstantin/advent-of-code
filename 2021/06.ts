import get from '../api';
import assert from 'assert';
import { sum } from 'lodash';

const day = '6';

function prepareInput(input: string) {
    return input.split(',').map(Number);
}

function runA(input: Input) {
    for (let i = 0; i < 80; i++) {
        const newInput = [];
        let add = 0;
        for (let f of input) {
            if (f === 0) {
                newInput.push(6);
                add++;
            } else {
                newInput.push(f - 1);
            }
        }
        while (add--) {
            newInput.push(8);
        }
        input = newInput;
    }
    return input.length;
}

function runB(input: Input, days: number = 256) {
    const d: Record<number, number> = {}; // k=day starts producing, v=N of fish
    for (let f of input) {
        d[f] = (d[f] || 0) + 1;
    }
    for (let i = 1; i <= days; i++) {
        const v = d[i] || 0;
        let j = i + 9;
        while (j <= days + 8) {
            d[j] = (d[j] || 0) + v;
            j += 7;
        }
    }
    return sum(Object.values(d));
}

assert.equal(5934 , runA(prepareInput(`3,4,3,1,2`)));
assert.equal(5, runB(prepareInput(`3,4,3,1,2`), 1));
assert.equal(6, runB(prepareInput(`3,4,3,1,2`), 2));
assert.equal(9, runB(prepareInput(`3,4,3,1,2`), 4));
assert.equal(26 , runB(prepareInput(`3,4,3,1,2`), 18));
assert.equal(5934 , runB(prepareInput(`3,4,3,1,2`), 80));
assert.equal(26984457539, runB(prepareInput(`3,4,3,1,2`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
