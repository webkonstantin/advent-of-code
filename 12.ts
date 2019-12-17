import {negatePoint, splitLines, sumPoints} from './utils';
import {Point3, Vector3} from './types';
import {combination} from 'js-combinatorics';
import {sum, zip} from 'lodash';
import get from './api';

interface Moon {
  position: Point3;
  velocity: Point3;
}

export function getGravity<T extends number[]>(p1: T, p2: T): T {
  return zip(p1, p2).map(([v1, v2]) => {
    return Math.sign(v2 - v1);
  }) as T;
}

function parseMoons(data: string): Moon[] {
  return splitLines(data).map(s => {
    const position = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/.exec(s).slice(1, 4).map(Number) as Point3;
    return {position, velocity: [0, 0, 0]};
  });
}

function step(moons: Moon[]) {
  combination(moons, 2).forEach(([moon1, moon2]) => {
    const gravity = getGravity(moon1.position, moon2.position);
    moon1.velocity = sumPoints(moon1.velocity, gravity);
    moon2.velocity = sumPoints(moon2.velocity, negatePoint(gravity));
  });

  moons.forEach(moon => {
    moon.position = sumPoints(moon.position, moon.velocity);
  });
}

function* steps(moons: Moon[], i: number) {
  let n = 0;
  yield n;
  while (i-- > 0) {
    step(moons);
    n++;
    yield n;
  }
}

function getEnergy(moon: Moon): number {
  function sumAbs(v: Vector3): number {
    return sum(v.map(Math.abs));
  }

  return sumAbs(moon.position) * sumAbs(moon.velocity);
}

function runA(data: string) {
  const moons = parseMoons(data);
  Array.from(steps(moons, 1000));
  return sum(moons.map(getEnergy));
}

function runB(data: string) {
  const moons = parseMoons(data);
  const set = new Set<string>();
  for (const step of steps(moons, 100000)) {
    const snap = JSON.stringify(moons);
    if (set.has(snap)) {
      console.log(step);
      break;
    }
    set.add(snap);
  }
}

const run = async () => {
  const data = await get('2019/day/12/input');

  console.log(runA(data));
  // console.log(runB(data));
};

if (require.main === module) {
  run();
}
