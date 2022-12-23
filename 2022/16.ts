// @ts-nocheck
import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { keyBy, range } from 'lodash';

const day = '16';

function prepareInput(input: string) {
  return keyBy(splitLines(input).map(line => {
    const w = line.split(' ');
    const valve = w[1];
    const flow = Number(w[4].slice(5, -1));
    const next = w.slice(9).join('').split(',');
    // console.log(line);
    // console.log({ valve, flow, next });
    return { valve, flow, next };
  }), 'valve');
}

function runA(V: Input) {
  console.log(V);
  console.log(Object.values(V).filter(v => v.flow).length);
  console.log(range(16).slice(1).reduce((a,b) => a*b));
  let max = 0;
  // let curr = 'AA', open = new Set(), sum = 0, minute = 0;
  // const ;
  const go = (curr: string, open = new Set(), sum = 0, minute = 0, path = []) => {
    // if (open.has('BB') && open.has('DD')) {
    //   console.log(curr, open, sum, minute, path)
    // }
    // if (minute === 6) console.log(curr, open, sum, minute, path);
    if (minute > 6) return;
    path.push(curr);
    // open / dont open
    const v = V[curr];
    const F = v.flow * (30 - minute);
    for (const n of v.next) {
      if (!open.has(curr) && F) {
        open.add(curr);
        go(n, open, sum + F, minute + 2, path);
        open.delete(curr);
      }
      go(n, open, sum, minute + 1, path);
    }
    path.pop();
  };
  // go('AA');
  return max;
}

function runB(V: Input) {
  //
}

const ex = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;
// assert.strictEqual(1651, runA(prepareInput(ex)));
// assert.strictEqual(0, runB(prepareInput(ex)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  // console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
