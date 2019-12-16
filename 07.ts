import assert from 'assert';
import get from './api';
import {splitNumbers} from './utils';
import {exec, execGenerator} from './05';
import {permutation} from 'js-combinatorics';

const signal = (program: number[], phase: number[]) => {
  return phase.reduce((input, phase) => {
    return exec(program, [phase, input]).outputs.pop();
  }, 0);
};

const signalLoop = (program: number[], phase: number[]): number | void => {
  const amps = phase.map((ph) => execGenerator(program.slice(), [ph]));

  let done = false;

  function getResult(initialInput: number[] = []) {
    return amps.reduce((input: number[], amp, index): number[] => {
      const outputs: number[] = [];
      let next = amp.next();

      while (!next.done) {
        if (typeof next.value === 'number') {
          outputs.push(next.value);
        } else if (input.length === 0) {
          break;
        }
        next = amp.next(input.shift());
      }

      done = done || next.done;

      return outputs;
    }, initialInput);
  }

  let result = getResult([0]);
  while (!done) {
    result = getResult(result);
  }

  return result[0];
};

const maxSignal = (program: number[]) => {
  let max = -Infinity;
  const permute = permutation([...Array(5).keys()]);
  permute.forEach(phase => {
    const sig = signal(program, phase);
    max = Math.max(sig, max);
  });

  return max;
};

const maxSignalLoop = (program: number[]) => {
  let max = -Infinity;
  const permute = permutation([...Array(5).keys()].map(n => n + 5));
  permute.forEach(phase => {
    const sig = signalLoop(program, phase);
    max = Math.max(sig || 0, max);
  });

  return max;
};

assert.equal(
  signal(
    splitNumbers('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'),
    splitNumbers('4,3,2,1,0'),
  ),
  43210
);

assert.equal(
  maxSignal(splitNumbers('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0')),
  43210
);

assert.equal(
  maxSignal(splitNumbers('3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0')),
  54321
);

assert.equal(
  signalLoop(
    splitNumbers('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'),
    splitNumbers('9,8,7,6,5'),
  ),
  139629729
);

assert.equal(
  maxSignalLoop(
    splitNumbers('3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'),
  ),
  139629729
);

assert.equal(
  signalLoop(
    splitNumbers('3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'),
    splitNumbers('9,7,8,5,6'),
  ),
  18216
);

assert.equal(
  maxSignalLoop(
    splitNumbers('3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'),
  ),
  18216
);

const run = async () => {
  const data = await get('2019/day/7/input');
  const program = splitNumbers(data);

  console.log(maxSignal(program));
  console.log(maxSignalLoop(program));
};

if (require.main === module) {
  run();
}
