import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '10';

function prepareInput(input: string) {
    return splitLines(input);
}

function runA(input: Input) {
    let sum = 0;
    let cycles = 1;
    let x = 1;
    const track = (cycle: number, x: number) => {
        if (((cycle - 20) % 40) === 0) {
            sum += cycle * x;
        }
    };
    for (const line of input) {
        track(cycles, x);
        cycles += 1;
        if (line !== 'noop') {
            const val = Number(line.split(' ')[1]);
            track(cycles, x);
            cycles += 1;
            x += val;
        }
    }
    return sum;
}

function runB(input: Input) {
    const w = 40;
    let cycles = 1;
    let x = 1;
    const lines: string[] = [];
    const track = (cycle: number, x: number) => {
        const left = (cycle - 1) % w;
        const top = Math.floor((cycle - 1) / w);
        lines[top] = lines[top] || '';
        lines[top] += Math.abs(left - x) <= 1 ? '#' : '.';
    };
    for (const line of input) {
        track(cycles, x);
        cycles += 1;
        if (line !== 'noop') {
            const val = Number(line.split(' ')[1]);
            track(cycles, x);
            cycles += 1;
            x += val;
        }
    }
    return lines.join('\n');
}

const ex = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;
assert.strictEqual(13140, runA(prepareInput(ex)));
assert.strictEqual(`
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`.trim(), runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2022/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
