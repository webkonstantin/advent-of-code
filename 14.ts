import {splitLines} from './utils';
import {groupBy, keyBy, sum} from 'lodash';
import get from './api';
var util = require('util');

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

function stringifyChemicalAmount(c: ChemicalAmount): string {
  return `${c.amount} ${c.chemical}`;
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

  [util.inspect.custom](hint: string) {
    if (hint == 'number') {
      return 42;
    }
    return '123';
  }

  toString() {
    const inputs = this.inputs.map(stringifyChemicalAmount).join(', ');
    return `${inputs} => ${stringifyChemicalAmount(this.output)}`;
  }

  produce(amount: Amount, leftovers: ChemicalAmountsRecord): ChemicalAmount[] {
    const m = Math.ceil(amount / this.output.amount);
    const extra = this.output.amount * m - amount;

    const inputsRequired = this.inputs.map((input) => {
      let amountRequired = input.amount * m;

      return chemicalAmount(amountRequired, input.chemical);
    });

    console.log(inputsRequired, leftovers);

    inputsRequired.map(input => {
      if (leftovers[input.chemical]) {
        const taken = Math.min(leftovers[input.chemical], input.amount);

        console.log('taken', taken, input.chemical);

        input.amount -= taken;
        leftovers[input.chemical] -= taken;

        if (leftovers[input.chemical] === 0) delete leftovers[input.chemical];
      }
    });

    console.log(inputsRequired, leftovers);

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

export function runA(data: string) {
  const reactions: Reaction[] = splitLines(data).map(Reaction.parse);
  const reactionsLookup: Record<Chemical, Reaction> = keyBy(reactions, (v) => v.output.chemical);

  function need(v: ChemicalAmount): number {
    let ore = 0;
    let required: ChemicalAmount[] = [v];

    const leftovers: ChemicalAmountsRecord = {};

    while (required.length) {
      const next = required.shift();
      const reaction = reactionsLookup[next.chemical];

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

      console.log('=>', required.map(r => [r.amount, r.chemical]));
      console.log(leftovers);
      console.log('=================')
    }


    return ore;
  }

  return need(chemicalAmount(1, 'FUEL'));
}

const run = async () => {
  const data = await get('2019/day/14/input');

  console.log(runA(data));

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
