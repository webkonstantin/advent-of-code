import assert from 'assert';
import lodash from 'lodash';
import get from './api';
import {splitLines} from './utils';
import {Point2} from './types';

const subtractPoints = (p1: Point2, p2: Point2): Point2 => {
  return [
    p1[0] - p2[0],
    p1[1] - p2[1],
  ];
}

const vectorLength = (vector: Point2) => {
  return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}

function getPoints(data: string): Point2[] {
  return splitLines(data).map((line: string, y: number) => {
    const chars: string[] = line.split('');

    return chars.map((char: string, x: number) => {
      if (char === '#') {
        return [x, y] as Point2;
      }
    });
  }).flat(1).filter(Boolean);
}

function findMaxPoint(points: Point2[]) {
  let maxVisible = -Infinity;
  let maxPoint: Point2;

  points.forEach(point => {
    const directions = points.filter(p => p !== point).map(otherPoint => {
      const vector = subtractPoints(otherPoint, point);
      return Math.atan2(vector[1], vector[0]);
    });

    const size = (new Set(directions)).size;
    if (size > maxVisible) {
      maxVisible = size;
      maxPoint = point;
    }
  });

  return {maxVisible, maxPoint};
}

const findMaxVisible = (data: string) => {
  const points = getPoints(data);

  let {maxVisible} = findMaxPoint(points);

  return maxVisible;
}


const findVaporized = (data: string, num: number) => {
  const points = getPoints(data);

  let {maxVisible, maxPoint} = findMaxPoint(points);

  const angles = points.filter(p => p !== maxPoint).map(otherPoint => {
    const vector = subtractPoints(otherPoint, maxPoint);
    return {
      vector,
      length: vectorLength(vector),
      angle: Math.atan2(vector[0], vector[1]),
      point: otherPoint,
    };
  });

  const grouped = lodash.groupBy(angles, 'angle');
  const prepared = lodash.mapValues(grouped, (points, angle) => ({
    angle,
    points: lodash.sortBy(points, 'length'),
  }));
  const sorted = lodash.sortBy(Object.values(prepared), p => -Number(p.angle));

  let i = 0;
  let last;
  while (num--) {
    while (sorted[i].points.length === 0) {
      i = (i + 1) % sorted.length;
    }
    last = sorted[i].points.shift();
    i = (i + 1) % sorted.length;
  }
  return last.point[0] * 100 + last.point[1];
}

assert.equal(findMaxVisible([
  '.#..#',
  '.....',
  '#####',
  '....#',
  '...##'
].join('\n')), 8);

assert.equal(findMaxVisible(`.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`), '41');

assert.equal(findMaxVisible(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`), '210');

assert.equal(findVaporized(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`, 200), 802);

const run = async () => {
  const data = await get('2019/day/10/input');

  console.log(findMaxVisible(data));
  console.log(findVaporized(data, 200));
};

if (require.main === module) {
  run();
}

