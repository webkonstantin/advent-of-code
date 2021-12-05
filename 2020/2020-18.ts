// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { sum } from 'lodash';

const ops = {
    '+': (a: number, b: number) => a + b,
    '*': (a: number, b: number) => a * b,
};

type Expr = (number | keyof typeof ops | Expr)[] | number;

function prepareInput(input: string) {
    return splitLines(input).map(ii => {
        const i = ii
            .replace(/ /g, '')
            .replace(/\(/g, '[')
            .replace(/\)/g, ']')
            .replace(/([+*])/g, ',"$1",');
        return eval(`[${i}]`) as Expr;
    });
}

function runA(input: Input) {
    const calc = (i: Expr) => {
        if (typeof i === 'number') return i;
        while (i.length > 1) {
            let [a, op, b] = [calc(i.shift()), i.shift(), calc(i.shift())];
            i.unshift(ops[op](a, b));
        }
        return i[0];
    };

    return sum(input.map(calc));
}

function runB(input: Input) {
    const calc = (i: Expr) => {
        if (typeof i === 'number') return i;
        let sumIndex: number;
        while ((sumIndex = i.indexOf('+')) !== -1) {
            let [a, op, b] = i.splice(sumIndex - 1, 3);
            [a, b] = [calc(a), calc(b)];
            i.splice(sumIndex - 1, 0, ops[op](a, b));
        }
        while (i.length > 1) {
            let [a, op, b] = [calc(i.shift()), i.shift(), calc(i.shift())];
            i.unshift(ops[op](a, b));
        }
        return i[0];
    };

    return sum(input.map(calc));
}

assert.equal(71, runA(prepareInput(`1 + 2 * 3 + 4 * 5 + 6`)));
assert.equal(51, runA(prepareInput(`1 + (2 * 3) + (4 * (5 + 6))`)));

assert.equal(231, runB(prepareInput(`1 + 2 * 3 + 4 * 5 + 6`)));
assert.equal(1445, runB(prepareInput(`5 + (8 * 3 + 9 + 3 * 4 * 3)`)));
assert.equal(669060, runB(prepareInput(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2020/day/18/input`);

    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
