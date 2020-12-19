import get from '../api';
import {CoordsString, Point2, Rect, Vector2} from './types';
import {execGenerator, Intcode, IntcodeInput} from './intcode';
import {parseCoords, sleep, splitNumbers, sumPoints} from './utils';

enum MOVEMENT {
  NORTH = 1,
  SOUTH = 2,
  WEST = 3,
  EAST = 4,
}

const MovementDirections: Map<MOVEMENT, Point2> = new Map([
  [MOVEMENT.NORTH, [0, -1]],
  [MOVEMENT.SOUTH, [0, 1]],
  [MOVEMENT.WEST, [-1, 0]],
  [MOVEMENT.EAST, [1, 0]],
]);

enum MovementResult {
  WALL = 0,
  OK = 1,
  FINISH = 2,
}

class Robot {
  private intcode: Intcode;
  private next: IteratorResult<number>;
  private input: number[] = [];

  private position: Point2 = [0, 0];
  private walls = new Set<CoordsString>();
  private distance = new Map<CoordsString, number>();

  constructor(program: number[]) {
    program = program.slice();
    this.intcode = execGenerator(program, this.input);
  }

  private key(point?: Point2): CoordsString {
    return (point || this.position).toString();
  }

  getDistance(point: Point2): number {
    return this.distance.get(this.key(point));
  }

  setDistance(point: Point2, distance: number) {
    this.distance.set(this.key(point), distance);
    // console.log(point, distance);
  }

  getBoundingRect(): Rect {
    const points = [...this.distance.keys()].map(parseCoords);

    return {
      top: Math.min(...points.map(p => p[1])),
      bottom: Math.max(...points.map(p => p[1])),
      left: Math.min(...points.map(p => p[0])),
      right: Math.max(...points.map(p => p[0])),
    };
  }

  run() {
    this.next = this.intcode.next();
    while (!this.next.done) {
      const output = this.next.value;
      if (typeof output === 'number') {
        return output;
      }
      this.next = this.intcode.next();
    }
  }

  move(movement: MOVEMENT): MovementResult {
    this.input.push(movement);

    return this.run();
  }

  private isOpposite(v1: Vector2, v2: Vector2) {
    const sum = sumPoints(v1, v2);

    return sum[0] === 0 && sum[1] === 0;
  }

  path: Point2[] = [];

  async find(distance: number, position: Point2, direction?: Vector2): Promise<number> {
    this.setDistance(position, distance);
    if (distance > 1000) return Infinity;

    let min = Infinity;

    for (const [movement, dir] of MovementDirections.entries()) {

      if (direction && this.isOpposite(direction, dir)) {
        continue;
      }

      const newPosition = sumPoints(position, dir);
      const distanceToNew = this.getDistance(newPosition);
      if (distanceToNew && distanceToNew <= distance + 1) {
        continue;
      }

      const result: MovementResult = this.move(movement);

      switch (result) {
        case MovementResult.FINISH:
          return distance + 1;
        case MovementResult.OK:
          const fromNewPosition = await this.find(distance + 1, newPosition, dir);
          min = Math.min(min, fromNewPosition);
          this.move(this.oppositeMovement(movement));
          break;
        case MovementResult.WALL:
          this.setDistance(newPosition, Infinity);
      }
    }

    this.render();
    await sleep(500);

    return min;
  }

  private oppositeMovement(movement: MOVEMENT): MOVEMENT {
    if (movement % 2 === 0) {
      return movement - 1;
    }
    return movement + 1;
  }

  private render() {
    const readline = require('readline')
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout);

    // console.log(this.score || 0);

    const rect = this.getBoundingRect();

    for (let y = rect.top; y <= rect.bottom; y++) {
      let line = '';
      for (let x = rect.left; x <= rect.right; x++) {
        const d = this.getDistance([x, y]);
        if (typeof d === 'number') {
          if (d === Infinity) {
            line += '#';
          } else {
            line += ' ';
          }
        } else {
          line += '#';
        }
      }
      console.log(line);
    }
  }
}

async function runA(program: number[]) {
  const robot = new Robot(program);

  const distance = await robot.find(0, [0, 0]);

  console.log(distance);
}

function runB() {
  //
}

const run = async () => {
  const data = await get('2019/day/15/input');

  const program = splitNumbers(data);

  console.log(runA(program));
  // console.log(runB());
};

if (require.main === module) {
  run();
}
