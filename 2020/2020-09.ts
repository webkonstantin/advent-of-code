import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '9';

function prepareInput(input: string) {
    return splitLines(input).map(Number);
}

function runA(nums: Input, preamble = 25) {
    const sw: number[] = [];

    return nums.find((num, index) => {
        if (index > 0) sw.push(nums[index - 1]);
        while (sw.length > preamble) sw.shift();

        if (sw.length === preamble) {
            const set = new Set(sw);
            for (const a of sw) {
                let a2 = num - a;
                if (a !== a2 && set.has(a2)) {
                    return false;
                }
            }
            return true;
        }
    });
}

function runB(nums: Input, preamble = 25) {
    const invalidNum = runA(nums, preamble);

    const minMax = (l: number, r: number) => {
        let values = nums.slice(l, r + 1);
        return Math.min(...values) + Math.max(...values);
    };

    for (let l = 0; l < nums.length; l++) {
        let sum = nums[l];
        for (let r = l + 1; r < nums.length; r++) {
            sum += nums[r];
            if (sum === invalidNum) return minMax(l, r);
            if (sum > invalidNum) break;
        }
    }
}

assert.equal(127, runA(prepareInput(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`), 5));

assert.equal(62, runB(prepareInput(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`), 5));
// assert.equal(0, runB(prepareInput(``)));

// assert.equal(0, runA(prepareInput(``)));
// assert.equal(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
