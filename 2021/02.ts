import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '2';

function prepareInput(input: string) {
    return input;
}

function runA(input: Input) {
    let x = 0, y = 0, aim = 0;
    const a = {
        f: (i: number) => (x += i, y += aim * i),
        d: (i: number) => (aim += i),
        u: (i: number) => (aim -= i),
    };
    for (let i of splitLines(input)) {
        const [dir, dist] = i.split(' ');
        // @ts-ignore
        a[dir[0]](parseInt(dist));
    }
    return x * y;
}

function runB(input: Input) {
    //
}

assert.equal(900, runA(prepareInput(`forward 5
down 5
forward 8
up 3
down 8
forward 2`)));
// assert.equal(900, runB(prepareInput(`forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2`)));

// assert.equal(0, runA(prepareInput(``)));
// assert.equal(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2021/day/${day}/input`));

    console.log(runA(input));
    // console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
