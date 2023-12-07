import * as fs from 'fs';
import { sum } from 'lodash-es';

let input = fs.readFileSync('input01.txt', 'utf8');
let lines = input.split('\n').filter(Boolean);
console.log(sum(lines.map(line => {
    const digits = line.match(/\d/g)!.map(Number);
    return digits[0] * 10 + digits[digits.length - 1];
})));
const toNumber = (s) => {
    const nums = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    if (nums.includes(s)) {
        return nums.indexOf(s) + 1;
    }
    return Number(s);
};
console.assert(toNumber('1') === 1);
console.assert(toNumber('one') === 1);
const getDigits = function (line: string) {
    const digits = [];
    for (let i = 0; i < line.length; i++) {
        const s = line.slice(i);
        const m = s.match(/^(\d|one|two|three|four|five|six|seven|eight|nine)/);
        if (m) {
            const d = m![0];
            digits.push(d);
        }
    }
    return digits.map(toNumber);
};
console.log(sum(lines.map(line => {
    const digits = getDigits(line);
    return digits[0] * 10 + digits[digits.length - 1];
})));
