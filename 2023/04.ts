import * as fs from 'fs';
import * as assert from 'assert';
import { range, sum } from 'lodash-es';


function part1(input: string) {
    const lines = input.trim().split('\n');
    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [left, right] = line.split(' | ');
        const [_, winning] = left.split(': ');
        let value = 0;
        for (const n of right.trim().split(/ +/).map(Number)) {
            if (winning.trim().split(/ +/).map(Number).includes(n)) {
                value++;
            }
        }
        if (value > 0) {
            const pow = 2 ** (value - 1);
            sum += pow;
        }
    }
    return sum;
}

function part2(input: string) {
    const lines = input.trim().split('\n');
    const arr = new Array(lines.length).fill(1);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [left, right] = line.split(' | ');
        const [_, winning] = left.split(': ');
        let value = 0;
        for (const n of right.trim().split(/ +/).map(Number)) {
            if (winning.trim().split(/ +/).map(Number).includes(n)) {
                value++;
            }
        }
        while (value > 0) {
            arr[i + value] += arr[i];
            value--;
        }
    }
    return sum(arr);
}

const sample = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.trim();

assert.equal(part1(sample), 13);
assert.equal(part2(sample), 30);

const input = fs.readFileSync('input04.txt', 'utf8');

console.log(part1(input));
console.log(part2(input));
