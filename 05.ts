import assert from 'assert';
import get from './api';
import {splitNumbers} from './utils';

interface ParsedOpcode {
  operate: (a: number[], ...numbers: number[]) => Generator<number | undefined, OpcodeResult | undefined, number>;
  length: number;
}

interface OpcodeResult {
  jump?: number;
}

interface ExecResult {
  program: number[];
  outputs: number[];
}
function parseOpcode(instruction: number, input: number[] = []): ParsedOpcode {
  const opcode = Number(String(instruction).slice(-2));
  const modes = String(instruction).slice(0, -2).split('').reverse();

  const readParam = (program: number[], params: number[], pos: number): number => {
    if (Number(modes[pos] || 0)) {
      return params[pos];
    }
    return program[params[pos]];
  };

  const appendInput = (n?: number) => {
    if (typeof n === 'number') {
      input.push(n);
    }
  };

  const opcodes: Record<number, () => ParsedOpcode> = {
    1() {
      return {
        *operate(program, i, ...params) {
          program[params[2]] = readParam(program, params, 0) + readParam(program, params, 1);

          return undefined;
        },
        length: 4,
      };
    },
    2() {
      return {
        *operate(program, i, ...params) {
          program[params[2]] = readParam(program, params, 0) * readParam(program, params, 1);

          return undefined;
        },
        length: 4,
      };
    },
    3() {
      return {
        *operate(program, i, ...params) {
          while (input.length === 0) {
            appendInput(yield);
          }

          program[params[0]] = input.shift();

          return undefined;
        },
        length: 2,
      };
    },
    4() {
      return {
        *operate(program, i, ...params) {
          appendInput(yield readParam(program, params, 0));
          return undefined;
        },
        length: 2,
      };
    },
    5() {
      return {
        *operate(program, i, ...params) {
          if (readParam(program, params, 0)) {
            return {jump: readParam(program, params, 1)};
          }
        },
        length: 3,
      };
    },
    6() {
      return {
        *operate(program, i, ...params) {
          if (!readParam(program, params, 0)) {
            return {jump: readParam(program, params, 1)};
          }
        },
        length: 3,
      };
    },
    7() {
      return {
        *operate(program, i, ...params) {
          program[params[2]] = Number(readParam(program, params, 0) < readParam(program, params, 1));
          return undefined;
        },
        length: 4,
      };
    },
    8() {
      return {
        *operate(program, i, ...params) {
          program[params[2]] = Number(readParam(program, params, 0) === readParam(program, params, 1));
          return undefined;
        },
        length: 4,
      };
    },
  };

  return opcodes[opcode]();
}

export function* execGenerator(program: number[], input: number[] = []): Generator<number, void, number> {
  let i = 0;

  while (program[i] !== 99) {
    if (i >= program.length) {
      throw new Error('Program failure!');
    }
    const {operate, length} = parseOpcode(program[i], input);
    const result = yield* operate(program, i, ...program.slice(i + 1, i + length));

    if (result && typeof result.jump !== 'undefined') {
      i = result.jump;
    } else {
      i += length;
    }
  }
}

export const exec = (program: number[], input: number[] = []): ExecResult => {
  program = program.slice();

  const gen = execGenerator(program, input);

  const outputs: number[] = [...gen];

  return {
    program,
    outputs,
  };
};

const execSplitJoin = (str: string) => exec(splitNumbers(str)).program.join(',');

assert.equal(
  execSplitJoin('1,9,10,3,2,3,11,0,99,30,40,50'),
  '3500,9,10,70,2,3,11,0,99,30,40,50'
);
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

const run = async () => {
  const data = await get('2019/day/5/input');
  const a = splitNumbers(data);

  console.log(exec(a, [1]).outputs.pop());
  console.log(exec(a, [5]).outputs.pop());
};

if (require.main === module) {
  run();
}
