// @ts-nocheck
import assert from 'assert';
import get from '../api';

const day = '13';

function prepareInput(input: string) {
    return input.split('\n\n').map((x) => x.trim().split('\n').map(p => JSON.parse(p)));
}

const cmp = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (i >= b.length) return 1;
        const l = a[i];
        const r = b[i];
        if (typeof l === 'object' || typeof r === 'object') {
            const c = cmp(
              typeof l === 'object' ? l : [l],
              typeof r === 'object' ? r : [r]
            );
            if (c !== 0) return c;
        } else {
            if (l < r) return -1;
            if (l > r) return 1;
        }
    }
    if (b.length > a.length) return -1;
    return 0;
};

function runA(input: Input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        const [a,b] = input[i];
        if (cmp(a, b) < 0) sum += i + 1;
    }
    return sum;
}

function runB(input: Input) {
    const div1 = [[2]];
    div1._div = true;
    const div2 = [[6]];
    div2._div = true;
    input = input.flat();
    input.push(div1, div2);
    input.sort(cmp);
    let m = 1;
    for (let i = 0; i < input.length; i++) {
        if (input[i]._div) {
            m *= i + 1;
        }
    }
    return m;
}

const ex = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;
assert.strictEqual(13, runA(prepareInput(ex)));
assert.strictEqual(140, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
