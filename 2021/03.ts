import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '3';

function prepareInput(input: string) {
    return splitLines(input);
}

function runA(input: Input) {
    const len = input[0].length;
    const bits = new Array(len).fill(0);
    for (let line of input) {
        line.split('').forEach((c, i) => {
            bits[i] += Number(c);
        });
    }
    const gamma = bits.map(n => n > input.length / 2 ? 1 : 0).join('');
    const eps = bits.map(n => n > input.length / 2 ? 0 : 1).join('');
    return parseInt(gamma, 2) * parseInt(eps, 2);
}

function runB(input: Input) {
    const len = input[0].length;
    const getBits = (input: Input) => {
        const bits = new Array(len).fill(0);
        for (let line of input) {
            line.split('').forEach((c, i) => bits[i] += Number(c));
        }
        return bits;
    };
    let oxy = input;
    for (let i = 0; i < len && oxy.length > 1; i++) {
        const bits = getBits(oxy);
        oxy = oxy.filter(line => line[i] === (bits[i] >= oxy.length / 2 ? '1' : '0'));
    }
    let co2 = input;
    for (let i = 0; i < len && co2.length > 1; i++) {
        const bits = getBits(co2);
        co2 = co2.filter(line => line[i] === (bits[i] >= co2.length / 2 ? '0' : '1'));
    }
    return parseInt(oxy[0], 2) * parseInt(co2[0], 2);
}

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2021/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
