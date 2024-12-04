import { getInput } from './get-input';

const input = await getInput(2);
const lines = input.split('\n');

const isSafe = (levels: number[]) => {
  const pairs = levels.slice(1).map((level, i) => ([levels[i], level]));
  const signs = pairs.map(([a, b]) => Math.sign(b - a));
  const signsSet = new Set(signs);
  const diffs = pairs.map(([a, b]) => Math.abs(b - a));
  return signsSet.size === 1 && diffs.every((diff) => diff <= 3 && diff >= 1);
};

console.log(lines.filter((line) => {
  const levels = line.split(' ').map(Number);
  return isSafe(levels);
}).length);

console.log(lines.filter((line) => {
  const levels = line.split(' ').map(Number);
  for (let i = 0; i < levels.length; i++) {
    const levelWithout = levels.filter((_, j) => j !== i);
    if (isSafe(levelWithout)) {
      return true;
    }
  }
  return false;
}).length);
