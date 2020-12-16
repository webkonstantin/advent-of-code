import assert from 'assert';
import get from '../api';

const exec = (input: number[]) => {
  const a = input.slice();

  let i = 0;

  while (a[i] !== 99 && i < a.length) {
    if (a[i] === 1) {
      a[a[i + 3]] = a[a[i + 1]] + a[a[i + 2]];
    } else if (a[i] === 2) {
      a[a[i + 3]] = a[a[i + 1]] * a[a[i + 2]];
    } else {
      throw new Error('UNKNOWN OPCODE');
    }
    i += 4;
  }

  return a;
};

const splitNumbers = (str: string) => str.split(',').map(Number);

const execSplitJoin = (str: string) => exec(splitNumbers(str)).join(',');

assert.equal(
  execSplitJoin('1,9,10,3,2,3,11,0,99,30,40,50'),
  '3500,9,10,70,2,3,11,0,99,30,40,50'
);
assert.equal(
  execSplitJoin('1,0,0,0,99'),
  '2,0,0,0,99'
);
assert.equal(
  execSplitJoin('2,3,0,3,99'),
  '2,3,0,6,99'
);
assert.equal(
  execSplitJoin('2,4,4,5,99,0'),
  '2,4,4,5,99,9801'
);
assert.equal(
  execSplitJoin('1,1,1,4,99,5,6,0,99'),
  '30,1,1,4,2,5,6,0,99'
);

let a: number[];
const compute = (noun: number, verb: number): number => {
  const input = a.slice();
  input[1] = noun;
  input[2] = verb;

  return exec(input)[0];
};

const run = async () => {
  const data = await get('2019/day/2/input');
  a = splitNumbers(data);

  console.log(compute(12, 2));

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (compute(noun, verb) === 19690720) {
        console.log(100 * noun + verb);
      }
    }
  }
};

if (require.main === module) {
  run();
}

