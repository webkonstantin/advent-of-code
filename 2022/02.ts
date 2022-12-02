import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '2';

function prepareInput(input: string) {
    return splitLines(input).map((line) => line.split(' '));
}

function runA(input: Input) {
    let score = 0;
    for (const [opp, me] of input) {
        const opi = opp.charCodeAt(0) - 'A'.charCodeAt(0);
        const mei = me.charCodeAt(0) - 'X'.charCodeAt(0);
        score += mei + 1;
        if (opi === mei) {
            score += 3;
        }
        else if ((opi + 1) % 3 === mei) {
            score += 6;
        }
    }
    return score;
}

function runB(input: Input) {
    // X means you need to lose,
    // Y means you need to end the round in a draw, and
    // Z means you need to win
    let score = 0;
    for (const [opp, me] of input) {
        const opi = opp.charCodeAt(0) - 'A'.charCodeAt(0);
        let mei = me.charCodeAt(0) - 'X'.charCodeAt(0);
        if (mei === 0) {
            mei = (opi - 1 + 3) % 3;
        } else if (mei === 1) {
            mei = opi;
        } else if (mei === 2) {
            mei = (opi + 1) % 3;
        }
        score += mei + 1;
        if (opi === mei) {
            score += 3;
        }
        else if ((opi + 1) % 3 === mei) {
            score += 6;
        }
    }
    return score;
}

assert.strictEqual(15, runA(prepareInput(`A Y
B X
C Z`)));
assert.strictEqual(12, runB(prepareInput(`A Y
B X
C Z`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
