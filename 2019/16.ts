import get from '../api';
import memoize from 'memoizee';

const basePattern = [0, 1, 0, -1];

function* genPattern(position: number, length = Infinity, skipFirst = 1): Generator<number, number> {
  let basePatternIndex = 0;
  let index = 0;

  while (index <= length) {
    for (let i = 0; i <= position && index <= length; i++) {
      if (skipFirst) {
        skipFirst--;
      } else {
        yield basePattern[basePatternIndex];
      }
      index++;
    }
    basePatternIndex = (basePatternIndex + 1) % basePattern.length;
  }
}

function runPhase(seq: string, steps = 1) {
  let result = '';
  while (steps--) {
    result = '';
    for (let i = 0; i < seq.length; i++) {
      let sum = 0;
      const pattern = genPattern(i);

      for (let j = 0; j < seq.length; j++) {
        const input = Number(seq[j]);

        sum += pattern.next().value * input;
      }

      result += sum.toString().slice(-1);
    }
    seq = result;
  }

  return result;
}

function runA(seq: string) {
  return runPhase(seq, 100);
}

function* genPattern2(rep: number, length: number) {
  let index = -1;
  let value = 1;

  while (index < length) {
    index += rep + 1;
    for (let i = 0; i <= rep && index < length; i++) {
      yield [index, value];
      index++;
    }
    value = -value;
  }
}

function runB(seq: string, steps = 1, length: number = seq.length, range: [number, number] = [0, length]) {
  const getValue = memoize((position: number, phase: number): number => {
    if (phase === 0) {
      return Number(seq[position % seq.length]);
    }

    let sum = 0;
    for (const [index, value] of genPattern2(position, length)) {
      sum += value * getValue(index, phase - 1);
    }

    return Number(sum.toString().slice(-1));
  });

  let result = '';
  const [start, end] = range;
  for (let i = start; i < end; i++) {
    result += getValue(i, steps);
  }

  return result;
}

const getRange = (n: number) => [...Array(n).keys()];

const run = async () => {
  const data = await get('2019/day/16/input');

  // console.log(runA(data).slice(0, 8));



  function getPattern(rep: number, length: number) {
    const getPatternValue = memoize((repeat: number, position: number) => {
      return [...genPattern(repeat, length)][position];
    });
    return getRange(length).map(i => getPatternValue(rep, i));
  }

  function getPattern2(rep: number, length: number) {
    const pattern = Array(length).fill(0);
    for (const [index, value] of genPattern2(rep, length)) {
      pattern[index] = value;
    }
    return pattern;
  }

  // const length = 8;
  // const rep = 1;
  // console.log(getPattern(rep, length).join(','));
  // console.log(getPattern2(rep, length).join(','));
  // return;

  // const seq = '12345678';
  // const steps = 100;
  // const repeat = 20;
  // console.log(runPhase(seq.repeat(repeat), steps));
  // console.log(runB(seq, steps, seq.length * repeat));

  const seq = '03036732577212944063491565474664';
  const steps = 100;
  const repeat = 10000;
  const offset = Number(seq.slice(0, 7))
  const range: [number, number] = [offset, offset + 8];
  console.log(range);
  console.log(runB(seq, steps, seq.length * repeat, range));
};

if (require.main === module) {
  run();
}
