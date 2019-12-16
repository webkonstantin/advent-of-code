import get from './api';
import {splitNumbers} from './utils';
import {exec} from './intcode';

function runA(a: number[]) {
  return exec(a, [1]).outputs;
}

function runB(a: number[]) {
  return exec(a, [2]).outputs;
}

const run = async () => {
  const data = await get('2019/day/9/input');
  const a = splitNumbers(data);

  console.log(runA(a));
  console.log(runB(a));
};

if (require.main === module) {
  run();
}
