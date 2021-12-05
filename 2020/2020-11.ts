import get from '../api';
import { splitLines } from '../utils';
import assert from 'assert';

const day = '11';

function prepareInput(input: string) {
    return splitLines(input).map(row => row.split(''));
}


function runA(G: Input) {
    let rounds = 5;
    while (true) {
        const toEmpty: [number, number][] = [];
        const toSeat: [number, number][] = [];
        G.forEach((row, y) => row.forEach((seat, x) => {
            let occupied = 0;
            [-1, 0, 1].forEach(dy => [-1, 0, 1].forEach(dx => {
                if (dx === 0 && dy === 0) return;
                if (G[y + dy]?.[x + dx] === '#') occupied++;
            }));

            //If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
            if (seat === 'L' && occupied === 0) {
                toSeat.push([y, x]);
            }

            // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
            if (seat === '#' && occupied >= 4) {
                toEmpty.push([y, x]);
            }
            //Otherwise, the seat's state does not change.
        }));
        toEmpty.forEach(([y, x]) => {
            G[y][x] = 'L';
        });
        toSeat.forEach(([y, x]) => {
            G[y][x] = '#';
        });
        // Simulate your seating area by applying the seating rules repeatedly until no seats change state
        if (toSeat.length + toEmpty.length === 0) break;
    }

    return G.flat().filter(s => s === '#').length;
}

function runB(G: Input) {
    // let rounds = 5;
    while (true) {
        const toEmpty: [number, number][] = [];
        const toSeat: [number, number][] = [];
        G.forEach((row, y) => row.forEach((seat, x) => {
            let occupied = 0;
            [-1, 0, 1].forEach(dy => [-1, 0, 1].forEach(dx => {
                if (dx === 0 && dy === 0) return;
                let m = 1;
                while (G[y + (dy * m)]?.[x + (dx * m)] === '.') m++;
                if (G[y + (dy * m)]?.[x + (dx * m)] === '#') occupied++;
            }));

            //If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
            if (seat === 'L' && occupied === 0) {
                toSeat.push([y, x]);
            }

            // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
            if (seat === '#' && occupied >= 5) {
                toEmpty.push([y, x]);
            }
            //Otherwise, the seat's state does not change.
        }));
        toEmpty.forEach(([y, x]) => {
            G[y][x] = 'L';
        });
        toSeat.forEach(([y, x]) => {
            G[y][x] = '#';
        });
        // Simulate your seating area by applying the seating rules repeatedly until no seats change state
        if (toSeat.length + toEmpty.length === 0) break;
    }

    return G.flat().filter(s => s === '#').length;
}

// assert.equal(37, runA(prepareInput(`L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL`)));

assert.equal(26, runB(prepareInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`)));

// assert.equal(0, runA(prepareInput(``)));
// assert.equal(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    console.log(runA(prepareInput(await get(`2020/day/${day}/input`))));
    console.log(runB(prepareInput(await get(`2020/day/${day}/input`))));
};

if (require.main === module) {
    run().catch(console.error);
}
