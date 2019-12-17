import get from './api';
import {splitLines} from './utils';
import {groupBy, keyBy, sum} from 'lodash';

type Amount = number;
type Chemical = string;

interface ChemicalAmount {
  amount: Amount;
  chemical: Chemical;
}

type ChemicalAmountsRecord = Record<Chemical, Amount>;

function parseChemicalAmount(c: string): ChemicalAmount {
  const [amount, chemical] = c.split(' ');

  return {
    amount: Number(amount),
    chemical,
  };
}

class Reaction {
  inputs: ChemicalAmount[];
  output: ChemicalAmount;

  static parse(line: string): Reaction {
    const [inputs, output] = line.split(' => ');
    return new Reaction(
      inputs.split(', ').map(parseChemicalAmount),
      parseChemicalAmount(output),
    );
  };

  constructor(inputs: ChemicalAmount[], output: ChemicalAmount) {
    this.inputs = inputs;
    this.output = output;
  }

  produce(amount: Amount, leftovers: ChemicalAmountsRecord): ChemicalAmount[] {
    const m = Math.ceil(amount / this.output.amount);
    const extra = this.output.amount * m - amount;

    const inputsRequired = this.inputs.map((input) => {
      let amountRequired = input.amount * m;

      return chemicalAmount(amountRequired, input.chemical);
    });

    inputsRequired.map(input => {
      if (leftovers[input.chemical]) {
        const taken = Math.min(leftovers[input.chemical], input.amount);

        input.amount -= taken;
        leftovers[input.chemical] -= taken;
      }
    });

    if (extra > 0) {
      leftovers[this.output.chemical] = leftovers[this.output.chemical] || 0;
      leftovers[this.output.chemical] += extra;
    }

    return inputsRequired;
  }
}

function chemicalAmount(amount: number, chemical: string): ChemicalAmount {
  return {amount, chemical};
}

function produce(v: ChemicalAmount, reactions: Record<Chemical, Reaction>, leftovers: ChemicalAmountsRecord = {}): number {
  let ore = 0;
  let required: ChemicalAmount[] = [v];

  while (required.length) {
    const next = required.shift();
    const reaction = reactions[next.chemical];

    required.push(...reaction.produce(next.amount, leftovers));

    // Squash duplicates
    required = Object.entries(groupBy(required, 'chemical')).map(([chem, entries]) => {
      return chemicalAmount(sum(entries.map(e => e.amount)), chem);
    });

    // Count ore
    required = required.filter(v => {
      if (v.chemical === 'ORE') {
        ore += v.amount;
        return false;
      }
      return true;
    });
  }

  return ore;
}

export function runA(data: string) {
  const reactions = keyBy(splitLines(data).map(Reaction.parse), reaction => reaction.output.chemical);

  const leftovers = {};

  const fuel = chemicalAmount(1, 'FUEL');

  return produce(fuel, reactions, leftovers);
}

export function runB(data: string) {
  const reactions = keyBy(splitLines(data).map(Reaction.parse), reaction => reaction.output.chemical);

  const x = 1000000000000;

  function produceFuel(a = 1) {
    return produce(chemicalAmount(a, 'FUEL'), reactions);
  }

  const search = function (start: number, end: number): number {
    if (start >= end) return end;
    let mid = Math.floor((start + end) / 2);

    const ore = produceFuel(mid);
    if (ore === x) return mid;

    if (ore > x) {
      return search(start, mid - 1);
    } else {
      return search(mid + 1, end);
    }
  }

  return search(1000000, 5000000);
}

const run = async () => {
  const data = await get('2019/day/14/input');

  console.log(runA(data));
  console.log(runB(data));

//   console.log(runA(`9 ORE => 2 A
// 8 ORE => 3 B
// 7 ORE => 5 C
// 3 A, 4 B => 1 AB
// 5 B, 7 C => 1 BC
// 4 C, 1 A => 1 CA
// 2 AB, 3 BC, 4 CA => 1 FUEL`));

//   console.log(runA(`10 ORE => 10 A
// 1 ORE => 1 B
// 7 A, 1 B => 1 C
// 7 A, 1 C => 1 D
// 7 A, 1 D => 1 E
// 7 A, 1 E => 1 FUEL`));
};

if (require.main === module) {
  run();
}
