import get from './api';
import {splitLines} from './utils';
import { keyBy, sum, groupBy } from 'lodash';

function runA(a: number[]) {

}

type Value = [number, string];

function parseChemical(c: string): Value {
  const s = c.split(' ');
  return [Number(s[0]), s[1]];
}

const run = async () => {
  let data = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`;

  data = await get('2019/day/14/input');

  const eqs = keyBy(splitLines(data).map(line => {
    const [inputs, output] = line.split(' => ');
    return {
      output: parseChemical(output) as Value,
      inputs: inputs.split(', ').map(parseChemical) as Value[],
    };
  }), (v) => v.output[1]);

  function need(v: Value): number {
    let ore = 0;
    let out: Value[] = [v];

    while (out.length) {
      const n = out.shift();
      const eq = eqs[n[1]];
      const m = Math.ceil(n[0] / eq.output[0]);
      const inputs = eq.inputs.map((o) => {
        return [o[0] * m, o[1]] as Value;
      });

      out.push(...inputs);
      out = Object.entries(groupBy(out, '1')).map(([chem, entries]) => {
        return [sum(entries.map(e => e[0])), chem];
      });
      out = out.filter(v => {
        if (v[1] === 'ORE') {
          ore += v[0];
          return false;
        }
        return true;
      });
      // console.log(out);
    }

    return ore;
  }

  // console.log(eqs);
  console.log(need([1, 'FUEL']));
  // console.log(runA(a));
};

if (require.main === module) {
  run();
}
