import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { zip } from 'lodash';

const day = '5';

function prepareInput(input: string) {
    const [stacks_, moves_] = input.split('\n\n');

    const stacks = zip(...splitLines(stacks_).slice(0, -1).map(line => {
        const crates = [];
        for (let i = 1; i < line.length; i += 4) {
            crates.push(line[i]);
        }
        return crates;
    })).map(stack => {
        stack = stack.reverse();
        if (stack.indexOf(' ') !== -1) {
            stack = stack.slice(0, stack.indexOf(' '));
        }
        return stack;
    });

    const moves = splitLines(moves_).map(line => {
        const [count, from, to] = line
          .match(/move (\d+) from (\d+) to (\d+)/)
          .slice(1, 4)
          .map(Number);
        return { count, from, to };
    });

    return { stacks, moves };
}

function runA({ stacks, moves }: Input) {
    for (let { count, from, to } of moves) {
        while (count--) {
            stacks[to - 1].push(stacks[from - 1].pop());
        }
    }
    return stacks.map(s => s[s.length - 1]).join('');
}

function runB({ stacks, moves }: Input) {
    for (let { count, from, to } of moves) {
        const a = [];
        while (count--) {
            a.push(stacks[from - 1].pop());
        }
        stacks[to - 1].push(...a.reverse());
    }
    return stacks.map(s => s[s.length - 1]).join('');
}

const example = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;
assert.strictEqual('CMZ', runA(prepareInput(example)));
assert.strictEqual('MCD', runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
