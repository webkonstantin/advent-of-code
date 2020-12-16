import assert from 'assert';
import get from '../api';
import {splitLines} from './utils';

function fuelRequired(n: number) {
  return Math.max(0, Math.floor(n / 3) - 2);
}

function fuelRequiredRecursive(n: number) {
  let fuel = 0;
  while (n > 0) {
    n = fuelRequired(n);
    fuel += n;
  }
  return fuel;
}

assert.equal(2, fuelRequired(12));
assert.equal(2, fuelRequired(14));
assert.equal(654, fuelRequired(1969));
assert.equal(33583, fuelRequired(100756));
assert.equal(50346, fuelRequiredRecursive(100756));

const run = async () => {
  const data = await get('2019/day/1/input');

  const lines = splitLines(data);

  console.log(lines.reduce((acc, s) => {
    return acc + fuelRequired(parseInt(s));
  }, 0))

  console.log(lines.reduce((acc, s) => {
    return acc + fuelRequiredRecursive(parseInt(s));
  }, 0))
};

if (require.main === module) {
  run();
}

