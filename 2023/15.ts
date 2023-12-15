import * as assert from 'assert';
import { getInput } from './get-input';
import { range, sum } from 'lodash-es';

function hash(s: string) {
    let curr = 0;
    for (const c of s) {
        const asciiCode = c.charCodeAt(0);
        curr += asciiCode;
        curr *= 17;
        curr %= 256;
    }
    return curr;
}

function part1(input: string) {
    return sum(input.split(',').map(hash));
}

function part2(input: string) {
    const boxes = Array.from({ length: 265 }, () => ({} as Record<string, string>));
    for (const a of input.split(',')) {
        if (a.indexOf('=') !== -1) {
            const [label, value] = a.split('=');
            const box = hash(label);
            boxes[box][label] = value;
        } else {
            const [label] = a.split('-');
            const box = hash(label);
            delete boxes[box][label];
        }
    }
    let total = 0;
    for (const i of range(boxes.length)) {
        const box = boxes[i];
        const labels = Object.keys(box);
        for (const j of range(labels.length)) {
            const label = labels[j];
            const value = box[label];
            total += (i + 1) * (j + 1) * Number(value);
        }
    }
    return total;
}

const input = await getInput(15);

assert.equal(hash('HASH'), 52);
assert.equal(part1('rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'), 1320);
assert.equal(part2('rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'), 145);

console.log(part1(input));
console.log(part2(input));
