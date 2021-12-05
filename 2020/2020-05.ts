import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
// import { range } from 'lodash';

const day = '5';

function prepareInput(input: string) {
    return splitLines(input)
        .map(s => s.replace(/[FL]/g, '0').replace(/[BR]/g, '1'))
        .map(s => parseInt(s, 2));
}

function runA(input: Input) {
    return Math.max(...input);
}

function runB(input: Input) {
    return 1 + input
        .sort((a, b) => a - b)
        .find((n, i) => input[i + 1] > n + 1);
}

assert.equal(567, prepareInput('BFFFBBFRRR'));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}

// function getRowCol(input: string) {
//     let [f, b] = [0, 127];
//     for (let i = 0; i < 7; i++) {
//         if (input[i] === 'F') {
//             b = Math.floor((f + b) / 2);
//         } else {
//             f = Math.ceil((f + b) / 2);
//         }
//     }
//     const row = f;
//     [f, b] = [0, 7];
//     for (let i = 7; i < 10; i++) {
//         if (input[i] === 'L') {
//             b = Math.floor((f + b) / 2);
//         } else {
//             f = Math.ceil((f + b) / 2);
//         }
//     }
//     const col = f;
//     return [row, col, row * 8 + col];
// }
