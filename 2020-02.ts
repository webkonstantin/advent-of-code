import get from './api';
import { splitLines } from './utils';
import assert from "assert";

function runA(input: string) {
    let valid = 0;
    for (const pwd of splitLines(input)) {
        const [range, letter, p] = pwd.split(' ');
        const [min, max] = range.split('-').map(Number);

        let num = 0;
        for (const char of p) {
            if (char === letter[0]) num++;
        }
        if (num >= min && num <= max) valid++;
    }
    return valid;
}

function runB(input: string) {
    let valid = 0;
    for (const pwd of splitLines(input)) {
        const [range, letter, p] = pwd.split(' ');
        const [min, max] = range.split('-').map(Number);

        // xor?
        if (
            Number(p[min - 1] === letter[0]) +
            Number(p[max - 1] === letter[0]) === 1
        ) valid++;
    }
    return valid;
}

assert.equal(2, runA(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`));

assert.equal(1, runB(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`));


const run = async () => {
    const input = await get('2020/day/2/input');

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run();
}
