// @ts-nocheck
import assert from 'assert';
import get from '../api';

const day = '11';


function prepareInput(input: string) {
  return input.split('\n\n').map((m, i) => {
    let [_, items, op, test, next1, next2] = m.trim().split('\n');
    items = items.split(': ')[1].split(', ').map(Number);
    op = op.split(' = ')[1];
    test = Number(test.split(' by ')[1]);
    next1 = Number(next1.split('monkey ')[1]);
    next2 = Number(next2.split('monkey ')[1]);
    return { items, op, test, next1, next2, i };
  });
}

function runA(input: Input) {
  const inspected = {};
  for (let i = 0; i < 20; i++) {
    for (const m of input) {
      inspected[m.i] = (inspected[m.i] || 0) + m.items.length;
      for (let item of m.items) {
        item = Math.floor(eval(`let old = ${item}; ${m.op}`) / 3);
        input[(item % m.test === 0) ? m.next1 : m.next2].items.push(item);
      }
      m.items = [];
    }
  }
  return Object.values(inspected).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b);
}

function runB(input: Input) {
  const inspected = {};
  const mod = input.map(m => m.test).reduce((a, b) => a * b);
  for (let i = 0; i < 10000; i++) {
    for (const m of input) {
      inspected[m.i] = (inspected[m.i] || 0) + m.items.length;
      for (let item of m.items) {
        item = eval(`let old = ${item}; ${m.op}`) % mod;
        input[(item % m.test === 0) ? m.next1 : m.next2].items.push(item);
      }
      m.items = [];
    }
  }
  return Object.values(inspected).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b);
}

const ex = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;
assert.strictEqual(10605, runA(prepareInput(ex)));
assert.strictEqual(2713310158, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
