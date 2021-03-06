import assert from 'assert';
import get from '../api';
import {sumPoints, splitLines} from './utils';
import {Point2} from './types';

const distanceManhattan = (p1: Point2, p2: Point2): number => {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
};

const directions: Record<string, Point2> = {
  U: [0, 1],
  R: [1, 0],
  D: [0, -1],
  L: [-1, 0],
};

const parseMotion = (motion: string) => {
  const direction = directions[motion[0]];
  const distance = parseInt(motion.slice(1));

  return {direction, distance};
};

const travel = (p: Point2, motion: string, cb?: (p: Point2) => void): Point2 => {
  let {direction, distance} = parseMotion(motion);

  while (distance--) {
    p = sumPoints(p, direction);
    cb && cb(p);
  }

  return p;
}

const travelMultiple = (p: Point2, motions: string[], cb?: (p: Point2, steps: number) => void): Point2 => {
  let steps = 0;
  motions.forEach(motion => {
    p = travel(p, motion, (point) => {
      steps++;
      cb(point, steps);
    });
  });

  return p;
}

const findIntersection = (motions1: string[], motions2: string[]) => {
  const p: Point2 = [0, 0];

  const s1 = new Set<string>();

  let minDistance = Infinity;

  travelMultiple(p, motions1, (point: Point2) => {
    if (!s1.has(point.toString())) {
      s1.add(point.toString());
    }
  });

  travelMultiple(p, motions2, (point: Point2) => {
    if (s1.has(point.toString())) {
      const distanceToCurrent = distanceManhattan(p, point);
      if (distanceToCurrent < minDistance) {
        minDistance = distanceToCurrent;
      }
    }
  });

  return minDistance;
}

const findIntersectionSteps = (motions1: string[], motions2: string[]) => {
  const p: Point2 = [0, 0];

  const s1 = new Map<string, number>();

  let minSteps = Infinity;

  travelMultiple(p, motions1, (point: Point2, steps: number) => {
    if (!s1.has(point.toString())) {
      s1.set(point.toString(), steps);
    }
  });

  travelMultiple(p, motions2, (point: Point2, steps: number) => {
    if (s1.has(point.toString())) {
      const stepsToPoint = s1.get(point.toString()) + steps;
      if (stepsToPoint < minSteps) {
        minSteps = stepsToPoint;
      }
    }
  });

  return minSteps;
}

assert.equal(
  findIntersection(
    'R8,U5,L5,D3'.split(','),
    'U7,R6,D4,L4'.split(','),
  ),
  6
)

assert.equal(
  findIntersection(
    'R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','),
    'U62,R66,U55,R34,D71,R55,D58,R83'.split(','),
  ),
  159
)

assert.equal(
  findIntersection(
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(','),
    'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(','),
  ),
  135
)

assert.equal(
  findIntersectionSteps(
    'R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','),
    'U62,R66,U55,R34,D71,R55,D58,R83'.split(','),
  ),
  610
)

assert.equal(
  findIntersectionSteps(
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(','),
    'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(','),
  ),
  410
)

const run = async () => {
  const data = await get('2019/day/3/input');
  const [s1, s2] = splitLines(data);

  console.log(findIntersection(
    s1.split(','),
    s2.split(','),
  ));

  console.log(findIntersectionSteps(
    s1.split(','),
    s2.split(','),
  ));
};

if (require.main === module) {
  run();
}
