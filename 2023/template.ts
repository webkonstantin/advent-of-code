import * as assert from 'assert';
import { getInput } from './get-input';

function part1(input: string) {
    const lines = input.split('\n');
    const paragraphs = input.split('\n\n');
    const G = lines.map(line => line.split(''));
    const [W, H] = [G[0].length, G.length];
}

function part2(input: string) {
}

const input = await getInput();

const sample = ``.trim();

// assert.equal(part1(sample), );
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
