import * as fs from 'fs';
import * as assert from 'assert';
import { range } from 'lodash-es';


function part1(input: string) {
    const lines = input.trim().split('\n');
    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const ints = line.matchAll(/\d+/g);
        const hasSymbol = (len: number, index: number) => {
            for (const j of [-1, 1]) {
                for (const x of range(index - 1, index + len + 1)) {
                    const char = lines[i + j]?.[x];
                    if (char && char !== '.') return true;
                }
            }
            if (line[index - 1] && line[index - 1] !== '.') return true;
            if (line[index + len] && line[index + len] !== '.') return true;
        };
        for (const m of ints) {
            if (hasSymbol(m[0].length, m.index)) sum += Number(m[0]);
        }
    }
    return sum;
}

function part2(input: string) {
    const lines = input.trim().split('\n');
    const point = (x: number, y: number) => `${x},${y}`;
    const gears = {};
    const addGear = (x: number, y: number, n: number) => {
        const char = lines[y]?.[x];
        if (char !== '*') return;
        const p = point(x, y);
        gears[p] = (gears[p] || []);
        gears[p].push(n);
    };
    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const ints = line.matchAll(/\d+/g);
        for (const m of ints) {
            const len = m[0].length;
            const index = m.index;
            const num = Number(m[0]);
            for (const j of [-1, 1]) {
                for (const x of range(index - 1, index + len + 1)) {
                    addGear(x, i + j, num);
                }
            }
            addGear(index - 1, i, num);
            addGear(index + len, i, num);
        }
    }
    for (const nums of Object.values(gears)) {
        if (nums.length === 2) {
            sum += nums[0] * nums[1];
        }
    }
    return sum;
}

const sample = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();

assert.equal(part1(sample), 4361);
assert.equal(part2(sample), 467835);

const input = fs.readFileSync('input03.txt', 'utf8');

console.log(part1(input));
console.log(part2(input));
