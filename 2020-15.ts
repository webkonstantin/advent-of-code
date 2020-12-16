import assert from 'assert';
import get from './api';

const day = '15';

function prepareInput(input: string) {
    return input.split(',').map(Number);
}

function runA(input: Input, turns = 2020) {
    const seenTurn = new Map<number, number>();
    let next: number;
    let current: number;
    for (let i = 0; i < turns; i++) {
        current = i < input.length ? input[i] : next;
        next = seenTurn.has(current) ? i - seenTurn.get(current) : 0;
        seenTurn.set(current, i);
    }
    return current;
}

assert.equal(436, runA(prepareInput(`0,3,6`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input, 2020));
    console.log(runA(input, 30000000));
};

if (require.main === module) {
    run().catch(console.error);
}
