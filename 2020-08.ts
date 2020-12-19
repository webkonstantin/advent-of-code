import assert from 'assert';
import get from './api';
import { splitLines } from './utils';

const day = '8';

function prepareInput(input: string) {
    return splitLines(input);
}


function runA(input: Input) {
    const seen = new Set<number>();
    let line = 0;
    let acc = 0;
    let i = 0;
    while (!seen.has(line) && line < input.length) {
        // console.log(++i ,input[line]);
        seen.add(line);
        const [inst, num] = input[line].split(' ');
        if (inst === 'nop') {
            line++;
        } else if (inst === 'acc') {
            acc += Number(num);
            line++;
        } else if (inst === 'jmp') {
            line += Number(num);
        }
    }

    return [acc, line < input.length ? 'loop' : 'term', acc];
}

function runB(input: Input) {
    for (let i = 0; i < input.length; i++) {
        const ni = [...input];
        const [inst, num] = ni[i].split(' ');
        if (inst === 'nop') {
            ni[i] = `jmp ${num}`;
        } else if (inst ==='jmp' ){
            ni[i] = `nop ${num}`;
        }
        const [,loop, acc   ] = runA(ni);
        if (loop === 'term') {
            return acc;
        }
    }
}

// assert.equal(5, runA(prepareInput(`nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6`)));
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
