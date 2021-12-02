import assert from 'assert';
import get from '../api';
import { sum } from 'lodash';

const day = '4';

class Board {
    _board: number[][];
    _rows: Record<number, number> = {};
    _cols: Record<number, number> = {};
    _set: Set<number>;

    constructor(str: string) {
        this._board = str.split('\n').map(row => row.trim().split(/ +/).map(Number));
        this._set = new Set(this._board.flat());
    }

    draw(num: number) {
        this._set.delete(num);
        for (let row in this._board) {
            for (let col in this._board[row]) {
                if (this._board[row][col] === num) {
                    this._rows[row] = (this._rows[row] || 0) + 1;
                    this._cols[col] = (this._cols[col] || 0) + 1;
                }
            }
        }
    }

    wins() {
        for (let row in this._rows) {
            if (this._rows[row] === this._board.length) {
                return true;
            }
        }
        for (let col in this._cols) {
            if (this._cols[col] === this._board.length) {
                return true;
            }
        }
    }
}

function prepareInput(input: string) {
    const [nums, ...boards] = input.split('\n\n');
    const numsArr = nums.split(',').map(Number);
    return [numsArr, boards.map(board => new Board(board))] as const;
}


function runA([nums, boards]: Input) {
    for (let num of nums) {
        for (let i in boards) {
            const board = boards[i];
            board.draw(num);
            if (board.wins()) {
                return num * sum([...board._set]);
            }
        }
    }
}

function runB([nums, boards]: Input) {
    let last;
    const won = new Set();
    for (let num of nums) {
        for (let i in boards) {
            if (won.has(i)) {
                continue;
            }
            const board = boards[i];
            board.draw(num);
            if (board.wins()) {
                last = num * sum([...board._set]);
                won.add(i);
            }
        }
    }
    return last;
}

assert.equal(4512, runA(prepareInput(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`)));

assert.equal(1924, runB(prepareInput(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
