import get from '../api';
import {negatePoint, sleep, splitNumbers, sumPoints} from './utils';
import {execGenerator, Intcode, IntcodeInput} from './intcode';
import {Point2} from './types';

enum TILE {
  EMPTY = 0, // is an empty tile. No game object appears in this tile.
  WALL = 1, // is a wall tile. Walls are indestructible barriers.
  BLOCK = 2, // is a block tile. Blocks can be broken by the ball.
  PADDLE = 3, // is a horizontal paddle tile. The paddle is indestructible.
  BALL = 4, // is a ball tile. The ball moves diagonally and bounces off objects
}

const OUTPUT = {
  [TILE.EMPTY]: ' ', // is an empty tile. No game object appears in this tile.
  [TILE.WALL]: '◼', // is a wall tile. Walls are indestructible barriers.
  [TILE.BLOCK]: '✱', // is a block tile. Blocks can be broken by the ball.
  [TILE.PADDLE]: '―', // is a horizontal paddle tile. The paddle is indestructible.
  [TILE.BALL]: '⬤', // is a ball tile. The ball moves diagonally and bounces off objects
}

type CoordsString = string;

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function infiniteInput(number: number): IntcodeInput {
  return {
    shift: () => number,
    length: Infinity,
  };
}

class Arcade {
  private initialColor = TILE.EMPTY;
  public tiles: Map<CoordsString, TILE> = new Map();
  private readonly intcode: Intcode;
  input: IntcodeInput;
  private next: IteratorResult<number, void>;
  score: number;
  ballPosition: Point2;
  ballDirection: Point2;
  paddlePosition: Point2;

  constructor(program: number[], input: IntcodeInput = []) {
    program = program.slice();
    this.input = input;
    this.intcode = execGenerator(program, this.input);
  }

  private key(point: Point2): CoordsString {
    return (point).toString();
  }

  render() {
    const readline = require('readline')
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout);

    console.log(this.score || 0);

    const rect = this.getBoundingRect();
    for (let y = rect.top; y <= rect.bottom; y++) {
      let line = '';
      for (let x = rect.left; x <= rect.right; x++) {
        line += OUTPUT[this.getTile([x, y])];
      }
      console.log(line);
    }
  }

  private updateScreen(point: Point2, tile: TILE): void {
    const key = this.key(point);

    if (tile === TILE.EMPTY) {
      this.tiles.delete(key);
    } else {
      this.tiles.set(key, tile);
      if (tile === TILE.BALL) {
        if (this.ballPosition) {
          this.ballDirection = sumPoints(point, negatePoint(this.ballPosition));
        }
        this.ballPosition = point;
      }
      if (tile === TILE.PADDLE) {
        this.paddlePosition = point;
      }
    }
  }

  getBoundingRect(): Rect {
    const points = [...this.tiles.keys()].map(this.parseCoords);

    return {
      top: Math.min(...points.map(p => p[1])),
      bottom: Math.max(...points.map(p => p[1])),
      left: Math.min(...points.map(p => p[0])),
      right: Math.max(...points.map(p => p[0])),
    };
  }

  private parseCoords(coords: string): Point2 {
    return coords.split(',').map(Number) as Point2;
  }

  private setScore(score: number) {
    this.score = score;
  }

  run() {
    let outputs: [number?, number?, (TILE | number)?] = [];

    this.next = this.intcode.next();
    while (!this.next.done) {
      const output = this.next.value;
      if (typeof output === 'number') {
        outputs.push(output);
        if (outputs.length === 3) {
          const [x, y, tile] = outputs;
          if (x === -1 && y === 0) {
            this.setScore(tile as number);
          } else {
            this.updateScreen([x, y], tile);
          }
          outputs = [];
        }
      } else {
        break;
      }
      this.next = this.intcode.next();
    }

    this.render();

    // if (this.countTiles(TILE.BLOCK) === 0) {
    //
    // }

    return this.next.value;
  }

  private getTile(point: Point2) {
      return this.tiles.has(this.key(point))
        ? this.tiles.get(this.key(point))
        : this.initialColor;
  }

  countTiles(tile: TILE) {
    return [...this.tiles.values()].filter(t => t === tile).length;
  }
}

async function runA(program: number[]) {
  const arcade = new Arcade(program);
  await arcade.run();
  return arcade.countTiles(TILE.BLOCK);
}

async function runB(program: number[]) {
  program = program.slice();
  program[0] = 2;

  function keyboardInput() {
    let j = 0;

    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {
        if (key.name === 'left') {
          j = -1;
        }
        if (key.name === 'right') {
          j = 1;
        }
        if (key.name === 'space') {
          j = 0;
        }
      }
    });

    return () => j;
  }
  // const joystick = keyboardInput();

  const arcade = new Arcade(program);

  while (true) {
    arcade.run();
    if (arcade.ballPosition && arcade.paddlePosition) {
      arcade.input.push(Math.sign(arcade.ballPosition[0] - arcade.paddlePosition[0]));
    } else {
      arcade.input.push(0);
    }
    await sleep(1);
  }
}

const run = async () => {
  const data = await get('2019/day/13/input');
  const program = splitNumbers(data);

  // console.log(runA(program));
  console.log(await runB(program));
};

if (require.main === module) {
  run();
}
