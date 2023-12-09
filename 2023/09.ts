import * as assert from 'assert';
import { getInput } from './get-input';
import { sum } from 'lodash-es';

const ints = (s: string) => s.match(/-?\d+/g)!.map(Number);

const getNext = (nums: number[]) => {
    if (nums.every(n => n === 0)) return 0;
    const diffs = [];
    for (let i = 0; i < nums.length - 1; i++) {
        diffs.push(nums[i + 1] - nums[i]);
    }
    const nextDiff = getNext(diffs);
    // console.log({ diffs, nextDiff });
    const next = nums[nums.length - 1] + nextDiff;
    // console.log({ nums, next });
    return next;
};

function part1(input: string) {
    const lines = input.split('\n');
    return sum(lines.map(ints).map(nums => {
        let next = getNext(nums);
        // console.log(nums, next);
        return next;
    }));
}

function part2(input: string) {
    const lines = input.split('\n');
    return sum(lines.map(ints).map(nums => {
        let next = getNext(nums.reverse());
        // console.log(nums.reverse(), next);
        return next;
    }));
}

const input = await getInput(9);

const sample = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.trim();

assert.equal(part1(sample), 114);
assert.equal(part2(sample), 2);

console.log(part1(input)); // 2043183816
console.log(part2(input)); // 1118
