import assert from 'assert';
import get from './api';

const day = '6';

function prepareInput(input: string) {
    return input.split('\n\n');
}


function runA(input: Input) {
    let sum = 0;
    for (const group of input) {
        let o = {};
        for (const line of group.split('\n')) {
            for (const char of line) {
                // @ts-ignore
                o[char] = true;
            }
        }
        sum+=Object.keys(o).length;
    }
    return sum;
}

function runB(input: Input) {
    let sum = 0;
    for (const group of input) {
        let o = {};
        for (const line of group.split('\n')) {
            // console.log(line);
            for (const char of line) {
                // @ts-ignore
                o[char] = (o[char] || 0) + 1;
            }
        }
        Object.keys(o).forEach(k => {
            // @ts-ignore
            if (o[k] === group.split('\n').length) {
                sum++;
            }
        })
    }
    return sum;
}

assert.equal(11, runA(prepareInput(`abc

a
b
c

ab
ac

a
a
a
a

b`)));
assert.equal(6, runB(prepareInput(`abc

a
b
c

ab
ac

a
a
a
a

b`)));
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
