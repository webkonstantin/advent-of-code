import {splitNumbers} from './utils';

interface ParsedOpcode {
  operate: (...params: number[]) => Generator<number | undefined, OpcodeResult | undefined, number>;
  length: number;
}

interface OpcodeResult {
  jump?: number;
}

interface ExecResult {
  program: number[];
  outputs: number[];
}

enum ParamMode {
  POSITION = 0,
  IMMEDIATE = 1,
  RELATIVE = 2,
}

export function* execGenerator(program: number[], input: number[] = []): Generator<number, void, number> {
  let pointer = 0;
  let relativeBase = 0;

  function parseOpcode(instruction: number): ParsedOpcode {
    const opcode = Number(String(instruction).slice(-2));
    const modes: ParamMode[] = String(instruction).slice(0, -2).split('').reverse().map(Number);

    const readParam = (params: number[], pos: number): number => {
      const mode = modes[pos] || ParamMode.POSITION;

      if (mode === ParamMode.POSITION) {
        return program[params[pos]] || 0;
      }
      if (mode === ParamMode.IMMEDIATE) {
        return params[pos];
      }
      if (mode === ParamMode.RELATIVE) {
        return program[params[pos] + relativeBase] || 0;
      }
    };
    const writeParam = (params: number[], pos: number, value: number) => {
      const mode = modes[pos] || ParamMode.POSITION;

      if (mode === ParamMode.POSITION) {
        program[params[pos]] = value;
      }
      if (mode === ParamMode.IMMEDIATE) {
        throw new Error('Write to param in IMMEDIATE mode is not supported!');
      }
      if (mode === ParamMode.RELATIVE) {
        program[params[pos] + relativeBase] = value;
      }
    };

    const appendInput = (n?: number) => {
      if (typeof n === 'number') {
        input.push(n);
      }
    };

    const opcodes: Record<number, () => ParsedOpcode> = {
      1() {
        return {
          * operate(...params) {
            writeParam(params, 2, readParam(params, 0) + readParam(params, 1));

            return undefined;
          },
          length: 4,
        };
      },
      2() {
        return {
          * operate(...params) {
            writeParam(params, 2, readParam(params, 0) * readParam(params, 1));

            return undefined;
          },
          length: 4,
        };
      },
      3() {
        return {
          * operate(...params) {
            while (input.length === 0) {
              appendInput(yield);
            }

            writeParam(params, 0, input.shift());

            return undefined;
          },
          length: 2,
        };
      },
      4() {
        return {
          * operate(...params) {
            const output = readParam(params, 0);
            appendInput(yield output);
            return undefined;
          },
          length: 2,
        };
      },
      5() {
        return {
          * operate(...params) {
            if (readParam(params, 0)) {
              return {jump: readParam(params, 1)};
            }
          },
          length: 3,
        };
      },
      6() {
        return {
          * operate(...params) {
            if (!readParam(params, 0)) {
              return {jump: readParam(params, 1)};
            }
          },
          length: 3,
        };
      },
      7() {
        return {
          * operate(...params) {
            writeParam(params, 2, Number(readParam(params, 0) < readParam(params, 1)));
            return undefined;
          },
          length: 4,
        };
      },
      8() {
        return {
          * operate(...params) {
            writeParam(params, 2, Number(readParam(params, 0) === readParam(params, 1)));
            return undefined;
          },
          length: 4,
        };
      },
      9() {
        return {
          * operate(...params) {
            relativeBase += readParam(params, 0);
            return undefined;
          },
          length: 2,
        };
      },
    };

    return opcodes[opcode]();
  }

  while (program[pointer] !== 99) {
    if (pointer >= program.length) {
      throw new Error('Program failure!');
    }
    const {operate, length} = parseOpcode(program[pointer]);
    const params = program.slice(pointer + 1, pointer + length);
    const result = yield* operate(...params);

    if (result && typeof result.jump !== 'undefined') {
      pointer = result.jump;
    } else {
      pointer += length;
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

const execOutputs = (str: string) => exec(splitNumbers(str)).outputs.join(',');

execOutputs(
  '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99',
)
