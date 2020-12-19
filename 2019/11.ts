import get from '../api';
import {splitNumbers} from './utils';
import {execGenerator, Intcode, IntcodeInput} from './intcode';
import {CoordsString, Point2, Rect, Vector2} from './types';
import {sumPoints} from './utils';

enum COLOR {
  BLACK = 0,
  WHITE = 1,
}

enum TURN {
  LEFT = 0,
  RIGHT = 1,
}

const UP: Vector2 = [0, -1];

class Robot {
  private initialColor = COLOR.BLACK;
  private panels = new Map<CoordsString, COLOR>();
  private painted = new Set<CoordsString>();
  private position: Point2 = [0, 0];
  private direction: Vector2 = UP;
  private intcode: Intcode;
  private next: IteratorResult<number>;

  constructor(program: number[]) {
    program = program.slice();
    const input: IntcodeInput = {
      length: Infinity,
      shift: () => this.cameraInput(),
    };
    this.intcode = execGenerator(program, input);
  }

  private turn(turnDirection: TURN): void {
    if (turnDirection === TURN.LEFT) {
      this.direction = [this.direction[1], -this.direction[0]];
    }
    if (turnDirection === TURN.RIGHT) {
      this.direction = [-this.direction[1], this.direction[0]];
    }
    this.move();
  }

  private key(point?: Point2): CoordsString {
    return (point || this.position).toString();
  }

  cameraInput(point?: Point2): COLOR {
    return this.panels.has(this.key(point))
      ? this.panels.get(this.key(point))
      : this.initialColor;
  }

  private move() {
    this.position = sumPoints(this.position, this.direction);
  }

  paint(color: COLOR): void {
    this.panels.set(this.key(), color);
    this.painted.add(this.key());
  }

  numberOfPainted(): number {
    return this.painted.size;
  }

  getPaintedPoints(): [Point2[], Rect] {
    const points: Point2[] = [];
    const rect: Rect = {
      top: -0,
      right: 0,
      bottom: 0,
      left: -0,
    };
    for (const coords of this.painted.keys()) {
      const point = coords.split(',').map(Number) as Point2;
      points.push(point);

      rect.left = Math.min(rect.left, point[0]);
      rect.right = Math.max(rect.right, point[0]);
      rect.top = Math.min(rect.top, point[1]);
      rect.bottom = Math.max(rect.bottom, point[1]);
    }
    return [points, rect];
  }

  run() {
    let outputs: [COLOR?, TURN?] = [];

    this.next = this.intcode.next();
    while (!this.next.done) {
      const output = this.next.value;
      if (typeof output === 'number') {
        outputs.push(output);
        if (outputs.length === 1) {
          const [color] = outputs;
          this.paint(color);
        }
        if (outputs.length === 2) {
          const [color, turn] = outputs;
          this.turn(turn);
          outputs = [];
        }
      }
      this.next = this.intcode.next();
    }
  }
}

function runA(program: number[]) {
  const robot = new Robot(program);
  robot.run();
  return robot.numberOfPainted();
}

function runB(program: number[]) {
  const robot = new Robot(program);
  robot.paint(COLOR.WHITE);
  robot.run();
  const [_, rect] = robot.getPaintedPoints();
  for (let y = rect.top; y <= rect.bottom; y++) {
    let line = '';
    for (let x = rect.left; x <= rect.right; x++) {
      line += robot.cameraInput([x, y]) ? 'X' : ' ';
    }
    console.log(line);
  }
}

const run = async () => {
  const data = await get('2019/day/11/input');
  const program = splitNumbers(data);

  console.log(runA(program));
  console.log(runB(program));
};

if (require.main === module) {
  run();
}
