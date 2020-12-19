import get from '../api';
import {splitNumbers} from './utils';
import {exec} from './intcode';

function runA(a: any) {
  return exec(a, [1]).outputs.pop();
}

function runB(a: any) {
  return exec(a, [5]).outputs.pop();
}

const run = async () => {
  const data = await get('2019/day/5/input');
  const a = splitNumbers(data);

  console.log(runA(a));
  console.log(runB(a));
};

if (require.main === module) {
  run();
}
