import { getInput } from './get-input';
import { zip } from 'es-toolkit';

const input = await getInput(1);
const lines = input.split('\n');
// @ts-ignore
const [arr1, arr2] = zip(...lines.map(line => line.split(/\s+/).map(Number)));

arr1.sort((a, b) => a - b);
arr2.sort((a, b) => a - b);

const part1 = zip(arr1, arr2)
  .map(([a, b]) => Math.abs(a - b))
  .reduce((acc, i) => acc + i, 0);

console.log(part1);

const freqs2 = new Map<number, number>();
for (const i of arr2) {
    freqs2.set(i, (freqs2.get(i) || 0) + 1);
}

const part2 = arr1
  .map(i => i * (freqs2.get(i) || 0))
  .reduce((acc, i) => acc + i, 0);

console.log(part2);
