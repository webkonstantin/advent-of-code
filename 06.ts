import assert from 'assert';
import get from './api';
import {splitLines} from './utils';

type Orbiter = { orbitee?: Orbiter };

interface OrbitsTree {
  [key: string]: Orbiter;
}

function makeTree(s: string): OrbitsTree {
  const orbits = {} as OrbitsTree;

  splitLines(s).forEach(str => {
    const [orbetee, orbiter] = str.split(')');

    orbits[orbiter] = orbits[orbiter] || {} as Orbiter;
    orbits[orbetee] = orbits[orbetee] || {} as Orbiter;

    orbits[orbiter].orbitee = orbits[orbetee];
  });

  return orbits;
}

function* orbitees(orbits: OrbitsTree, key: string) {
  let current = orbits[key];
  while (current.orbitee) {
    yield current.orbitee;
    current = current.orbitee;
  }
}

const totalOrbitsNumber = (s: string): number => {
  const orbits = makeTree(s);

  return Object.keys(orbits).reduce((sum, orbiter) => {
    return sum + [...orbitees(orbits, orbiter)].length;
  }, 0);
};

const orbitTransfers = (s: string): number => {
  const orbits = makeTree(s);

  const youParents = [...orbitees(orbits, 'YOU')];

  let i = 0;
  for (const sanParent of orbitees(orbits, 'SAN')) {
    const index = youParents.indexOf(sanParent);
    if (index >= 0) {
      return index + i;
    }
    i++;
  }
};

assert.equal(totalOrbitsNumber(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`), 42);

assert.equal(orbitTransfers(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`), 4);

const run = async () => {
  const data = await get('2019/day/6/input');

  console.log(totalOrbitsNumber(data));
  console.log(orbitTransfers(data));
};

if (require.main === module) {
  run();
}

