import assert from 'assert';
import { splitLines } from '../utils';
import get from '../api';
import { chunk, intersection } from 'lodash';

const day = '3';

function prepareInput(input: string) {
    return splitLines(input);
}

const priority = (char: string) => {
    if (char === char.toLowerCase()) {
        return char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
        return char.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }
};

function runA(input: Input) {
    let sum = 0;
    for (const line of input) {
        const set = new Set([...line.slice(0, line.length / 2)]);
        for (const char of line.slice(line.length / 2)) {
            if (set.has(char)) {
                sum += priority(char);
                break;
            }
        }
    }
    return sum;
}

function runB(input: Input) {
    let sum = 0;
    for (const group of chunk(input, 3)) {
        const [badge] = intersection(...group.map((line) => line.split('')));
        sum += priority(badge);
    }
    return sum;
}

const example = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
assert.strictEqual(157, runA(prepareInput(example)));
assert.strictEqual(70, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
