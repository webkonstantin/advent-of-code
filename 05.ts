import assert from 'assert';
import get from './api';

interface Result {
  output?: number;
  jump?: number;
}

interface ParsedOpcode {
  operate: (a: number[], ...numbers: number[]) => Result | void;
  length: number;
}

function parseOpcode(instruction: number, input?: number) {
  const opcode = Number(String(instruction).slice(-2));
  const modes = String(instruction).slice(0, -2).split('').reverse();

  const readParam = (a: number[], params: number[], pos: number): number => {
    if (Number(modes[pos] || 0)) {
      return params[pos];
    }
    return a[params[pos]];
  };

  const opcodes: Record<number, () => ParsedOpcode> = {
    1() {
      return {
        operate(a, i, ...params) {
          a[params[2]] = readParam(a, params, 0) + readParam(a, params, 1);
        },
        length: 4,
      };
    },
    2() {
      return {
        operate(a, i, ...params) {
          a[params[2]] = readParam(a, params, 0) * readParam(a, params, 1);
        },
        length: 4,
      };
    },
    3() {
      return {
        operate(a, i, ...params) {
          a[params[0]] = input;
        },
        length: 2,
      };
    },
    4() {
      return {
        operate(a, i, ...params) {
          return {
            output: readParam(a, params, 0),
          };
        },
        length: 2,
      };
    },
    5() {
      return {
        operate(a, i, ...params) {
          if (readParam(a, params, 0)) {
            return {jump: readParam(a, params, 1)};
          }
        },
        length: 3,
      };
    },
    6() {
      return {
        operate(a, i, ...params) {
          if (!readParam(a, params, 0)) {
            return {jump: readParam(a, params, 1)};
          }
        },
        length: 3,
      };
    },
    7() {
      return {
        operate(a, i, ...params) {
          a[params[2]] = Number(readParam(a, params, 0) < readParam(a, params, 1));
        },
        length: 4,
      };
    },
    8() {
      return {
        operate(a, i, ...params) {
          a[params[2]] = Number(readParam(a, params, 0) === readParam(a, params, 1));
        },
        length: 4,
      };
    },
  };

  return opcodes[opcode]();
}

const exec = (program: number[], input?: number) => {
  const a = program.slice();

  let i = 0;

  const outputs: number[] = [];

  while (a[i] !== 99 && i < a.length) {

    const {operate, length} = parseOpcode(a[i], input);

    const result = operate(a, i, ...a.slice(i + 1, i + length));

    if (result && typeof result.output !== 'undefined') {
      outputs.push(result.output);
    }
    if (result && typeof result.jump !== 'undefined') {
      i = result.jump;
    } else {
      i += length;
    }
  }

  return [a, outputs];
};

const splitNumbers = (str: string) => str.split(',').map(Number);

const execSplitJoin = (str: string) => exec(splitNumbers(str))[0].join(',');

// assert.equal(
//   execSplitJoin('1,9,10,3,2,3,11,0,99,30,40,50'),
//   '3500,9,10,70,2,3,11,0,99,30,40,50'
// );
assert.equal(
  execSplitJoin('1,0,0,0,99'),
  '2,0,0,0,99'
);
assert.equal(
  execSplitJoin('1002,4,3,4,33'),
  '1002,4,3,4,99'
);
assert.equal(
  execSplitJoin('1101,100,-1,4,0'),
  '1101,100,-1,4,99'
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

const run = async () => {
  const data = await get('2019/day/5/input');
  a = splitNumbers(data);

  console.log(exec(a, 1)[1].pop());
  console.log(exec(a, 5)[1].pop());
};

run();
