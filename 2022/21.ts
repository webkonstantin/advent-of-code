// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { keyBy } from 'lodash';

const day = '21';

function prepareInput(input: string) {
    return keyBy(splitLines(input).map(line => {
        let [key, ...ops] = line.split(' ');
        key = key.replace(':', '');
        return { key, ops };
    }), 'key');
}

function runA(input: Input) {
    const calc = (key) => {
        const ops = input[key].ops;
        if (ops.length === 1) {
            return Number(ops[0]);
        }
        return eval(`${calc(ops[0])}${ops[1]}${calc(ops[2])}`);
    };
    return calc('root');
}

function runB(input: Input) {
    const calc = (key) => {
        if (key === 'humn') return 'x';
        const ops = input[key].ops;
        if (ops.length === 1) {
            return ops[0];
        }
        return `(${calc(ops[0])}${ops[1]}${calc(ops[2])})`;
    };
    input['root'].ops[1] = '-';
    return calc('root');
}

const ex = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`;
assert.strictEqual(152, runA(prepareInput(ex)));
// assert.strictEqual(0, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
