import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(5);

const part1 = (input: string) => {
  const [rules, updates] = input.split('\n\n');
  // console.log(rules);
  // console.log(updates);

  const graph: Map<number, number[]> = new Map();
  for (const [l, r] of rules.split('\n').map((line) => line.split('|').map(Number))) {
    graph.set(l, (graph.get(l) || []).concat(r));
  }

  let sum = 0;

  const isValid = (nums: number[]) => {
    const seen = new Set<number>();
    for (const num of nums) {
      const mustAfter = graph.get(num) || [];
      if (mustAfter.some((num) => seen.has(num))) return false;
      seen.add(num);
    }
    return true;
  }

  for (const update of updates.split('\n')) {
    const nums = update.split(',').map(Number);
    if (isValid(nums)) {
      sum += nums[(nums.length - 1) / 2];
    }
  }

  return sum;

};

assert.equal(part1(`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`.trim()), 143);

console.log(part1(input));
