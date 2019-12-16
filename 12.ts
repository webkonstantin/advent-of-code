import get from './api';
import {splitNumbers} from './utils';
import {exec, execGenerator, Intcode, IntcodeInput} from './intcode';
import {Point} from './types';


enum TILE {
  EMPTY = 0, // is an empty tile. No game object appears in this tile.
  WALL = 1, // is a wall tile. Walls are indestructible barriers.
  BLOCK = 2, // is a block tile. Blocks can be broken by the ball.
  HORIZONTAL = 3, // is a horizontal paddle tile. The paddle is indestructible.
  BALL = 4, // is a ball tile. The ball moves diagonally and bounces off objects
}

type CoordsString = string;

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

class Robot {
  private initialColor = TILE.EMPTY;
  private tiles = new Map<CoordsString, TILE>();
  private intcode: Intcode;
  private next: IteratorResult<number>;

  constructor(program: number[]) {
    program = program.slice();
    this.intcode = execGenerator(program);
  }

  private key(point: Point): CoordsString {
    return (point).toString();
  }

  paint(point: Point, tile: TILE): void {
    this.tiles.set(this.key(point), tile);
  }

  // run() {
  //   // let outputs: [COLOR?, TURN?] = [];
  //   let outputs: [COLOR?, TURN?] = [];
  //
  //   this.next = this.intcode.next();
  //   while (!this.next.done) {
  //     const output = this.next.value;
  //     if (typeof output === 'number') {
  //       outputs.push(output);
  //       if (outputs.length === 1) {
  //         const [color] = outputs;
  //         this.paint(color);
  //       }
  //       if (outputs.length === 2) {
  //         const [color, turn] = outputs;
  //         this.turn(turn);
  //         outputs = [];
  //       }
  //     }
  //     this.next = this.intcode.next();
  //   }
  // }
}

function runA(program: number[]) {
}

const run = async () => {
  const data = await get('2019/day/12/input');
  const program = splitNumbers(data);

  console.log(runA(program));
  // console.log(runB(program));
};

if (require.main === module) {
  run();
}
