import {lcm, negatePoint, splitLines, sumPoints} from './utils';
import {Point3, Vector1, Vector3} from './types';
import {combination} from 'js-combinatorics';
import {sum, zip} from 'lodash';
import get from './api';

interface Moon<T extends number[]> {
  pos: T;
  vel: T;
}

function getGravity<T extends number[]>(p1: T, p2: T): T {
  return zip(p1, p2).map(([v1, v2]) => {
    return Math.sign(v2 - v1);
  }) as T;
}

function step<T extends number[]>(moons: Moon<T>[]) {
  combination(moons, 2).forEach(([moon1, moon2]) => {
    const gravity = getGravity(moon1.pos, moon2.pos);
    moon1.vel = sumPoints(moon1.vel, gravity);
    moon2.vel = sumPoints(moon2.vel, negatePoint(gravity));
  });

  moons.forEach(moon => {
    moon.pos = sumPoints(moon.pos, moon.vel);
  });
}

function* steps<T extends number[]>(moons: Moon<T>[], maxSteps: number) {
  let n = 0;
  yield n;
  while (maxSteps-- > 0) {
    step(moons);
    n++;
    yield n;
  }
}

function parseMoons(data: string): Moon<Vector3>[] {
  return splitLines(data).map(s => {
    const position = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/.exec(s).slice(1, 4).map(Number) as Point3;
    return {pos: position, vel: [0, 0, 0]};
  });
}

function getEnergy(moon: Moon<Vector3>): number {
  function sumAbs(v: Vector3): number {
    return sum(v.map(Math.abs));
  }

  return sumAbs(moon.pos) * sumAbs(moon.vel);
}

function moonsSlice(moons: Moon<Vector3>[], coord: 0 | 1 | 2): Moon<Vector1>[] {
  return moons.map(moon => ({
    pos: [moon.pos[coord]],
    vel: [moon.vel[coord]],
  }));
}

function runA(data: string) {
  const moons = parseMoons(data);
  Array.from(steps(moons, 1000));
  return sum(moons.map(getEnergy));
}

function stepsToRepeat<T extends number[]>(moons: Moon<T>[], maxSteps = 1000000) {
  const set = new Set<string>();

  for (const step of steps(moons, maxSteps)) {
    const snap = moons.map(m => `${m.pos.toString()}${m.vel.toString()}`).toString(); //JSON.stringify(moons);
    if (set.has(snap)) {
      return step;
    }
    set.add(snap);
  }
}

function runB(data: string) {
  const moons = parseMoons(data);

  return lcm(...([0, 1, 2] as const).map(coord => stepsToRepeat(moonsSlice(moons, coord))));
}

const run = async () => {
  const data = await get('2019/day/12/input');

  console.log(runA(data));
  console.log(runB(data));
};

if (require.main === module) {
  run();
}
