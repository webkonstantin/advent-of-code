import get from './api';
import {splitNumbers} from './utils';
import {execGenerator, Intcode, IntcodeInput} from './intcode';
import {Point2} from './types';


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

class Arcade {
  private initialColor = TILE.EMPTY;
  public tiles: Map<CoordsString, TILE> = new Map();
  private readonly intcode: Intcode;
  input: IntcodeInput;
  // private input: number[] = [0,0,0,0];
  private next: IteratorResult<number, void>;
  score: number;

  constructor(program: number[], input: IntcodeInput = []) {
    program = program.slice();
    this.input = input;
    this.intcode = execGenerator(program, this.input);
  }

  private key(point: Point2): CoordsString {
    return (point).toString();
  }

  private paint(point: Point2, tile: TILE): void {
    const key = this.key(point);
    if (this.tiles.get(key) === TILE.BLOCK && tile !== TILE.BLOCK) {
      console.log('Broke block ' + key);
    }
    this.tiles.set(key, tile);
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
            this.score = tile;
            console.log('this.score', this.score)
          } else {
            this.paint([x, y], tile);
          }
          outputs = [];
        }
      }
      this.next = this.intcode.next();
    }

    return this.next.value;
  }
}

function runA(program: number[]) {
  const arcade = new Arcade(program);
  arcade.run();
  return [...arcade.tiles.values()].filter(tile => tile === TILE.BLOCK).length;
}

function runB(program: number[]) {
  program = program.slice();
  program[0] = 2;

  const arcade = new Arcade(program);
  arcade.run();

  const blockTiles = [...arcade.tiles.entries()]
    .filter(([key, tile]) => {
      return tile === TILE.BLOCK
    });

  return [blockTiles, arcade.score, arcade.input.length];
}

const run = async () => {
  const data = await get('2019/day/13/input');
  const program = splitNumbers(data);

  // console.log(runA(program));
  console.log(runB(program));
};

if (require.main === module) {
  run();
}
