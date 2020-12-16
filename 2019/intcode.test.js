const { splitNumbers } = require('./dist/utils');
const { exec } = require('./dist/intcode');

const execProgram = (str) => exec(splitNumbers(str)).program.join(',');
const execOutputs = (str) => exec(splitNumbers(str)).outputs.join(',');

test('intcode', () => {
  expect(execProgram('1,9,10,3,2,3,11,0,99,30,40,50')).toBe('3500,9,10,70,2,3,11,0,99,30,40,50');
  expect(execProgram('1,0,0,0,99')).toBe('2,0,0,0,99');
  expect(execProgram('1002,4,3,4,33')).toBe('1002,4,3,4,99');
  expect(execProgram('1101,100,-1,4,0')).toBe('1101,100,-1,4,99');
  expect(execProgram('2,3,0,3,99')).toBe('2,3,0,6,99');
  expect(execProgram('2,4,4,5,99,0')).toBe('2,4,4,5,99,9801');
  expect(execProgram('1,1,1,4,99,5,6,0,99')).toBe('30,1,1,4,2,5,6,0,99');
});

test('intcode day 9', () => {
  expect(execOutputs(
    '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99',
  )).toBe(
    '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99',
  );

  expect(execOutputs('1102,34915192,34915192,7,4,7,99,0').length).toBe(16);
  expect(execOutputs('104,1125899906842624,99')).toBe('1125899906842624');
});
