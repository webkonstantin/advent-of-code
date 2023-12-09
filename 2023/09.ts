import * as assert from 'assert';
import { getInput } from './get-input';
import { range, sum } from 'lodash-es';

const ints = (s: string) => s.match(/-?\d+/g)!.map(Number);

const getNext = (nums: number[]) => {
    if (nums.every(n => n === 0)) return 0;
    const diffs = range(nums.length - 1).map(i => nums[i + 1] - nums[i]);
    return nums[nums.length - 1] + getNext(diffs);
};

function part1(input: string) {
    return sum(input.split('\n').map(ints).map(getNext));
}

function part2(input: string) {
    return sum(input.split('\n').map(ints).map(nums => getNext(nums.reverse())));
}

const input = await getInput(9);

const sample = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.trim();

assert.equal(part1(sample), 114);
assert.equal(part2(sample), 2);

console.log(part1(input)); // 2043183816
console.log(part2(input)); // 1118
