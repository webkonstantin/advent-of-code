import { getInput } from './get-input';

const input = await getInput(3);

const part1 = (input: string) => {
  let sum = 0;
  const muls = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
  for (const mul of muls) {
    const [_, a, b] = mul;
    sum += Number(a) * Number(b);
  }
  return sum;
};

console.log(part1(input));

const part2 = (input: string) => {
  let sum = 0;
  let on = true;
  const muls = input.matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g);
  for (const mul of muls) {
    const [action, a, b] = mul.slice(1);
    if (action.startsWith('don')) {
      on = false;
    } else if (action.startsWith('do')) {
      on = true;
    } else if (on) {
      sum += Number(a) * Number(b);
    }
  }
  return sum;
};

console.log(part2(input));
// console.log(part2('xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))'));
