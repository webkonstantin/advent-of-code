import assert from 'assert';
import get from './api';
import { splitLines } from './utils';
import { fromPairs, times, range } from 'lodash';

const day = '17';

function prepareInput(input: string) {
    return splitLines(input).map(l => l.split(''));
}

//active (#) or inactive (.) state.
function runA(input: Input) {
    const arrayToEntries = <T>(a: T[]) => a.map((v, k) => ([k, v]));
    const arrToObj = <T>(line: T[]) => fromPairs(arrayToEntries(line));

    let G = arrToObj([arrToObj(input.map(arrToObj))]);

    const forEachG = (g: typeof G, cb: (x: number, y: number, z: number, c: string) => any) => {
        Object.entries(g).forEach(
            ([z, plane]) => {
                Object.entries(plane).forEach(
                    ([y, line]) => {
                        Object.entries(line).forEach(
                            ([x, char]) => {
                                cb(Number(x), Number(y), Number(z), char);
                            },
                        );
                    },
                );
            },
        );
    };

    const getPoint = (g: typeof G, x: number, y: number, z: number) => g?.[z]?.[y]?.[x];
    const setPoint = (g: typeof G, x: number, y: number, z: number, c: string) => {
        g[z] = g[z] || {};
        g[z][y] = g[z][y] || {};
        g[z][y][x] = c;
    };

    const cycle = (g: typeof G): typeof G => {
        const newG: typeof G = {};

        const activePoints: [number, number, number][] = [];
        forEachG(G, (x, y, z, c) => {
            if (c === '#') activePoints.push([x, y, z]);
        });

        const pRange = (n: number) => {
            const coord = activePoints.map(p => p[n]);
            return range(Math.min(...coord) - 1, Math.max(...coord) + 1 + 1);
        };

        const dd = [-1, 0, 1];

        for (const z of pRange(2)) {
            for (const y of pRange(1)) {
                for (const x of pRange(0)) {

                    let activeNear = 0;
                    for (const dz of dd) {
                        for (const dy of dd) {
                            for (const dx of dd) {
                                if (dx === 0 && dy === 0 && dz === 0) continue;
                                if (getPoint(g, x + dx, y + dy, z + dz) === '#') activeNear++;
                            }
                        }
                    }

                    const curr = getPoint(g, x, y, z);

                    //If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
                    // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
                    if (curr === '#' && activeNear >= 2 && activeNear <= 3) {
                        setPoint(newG, x, y, z, '#');
                    } else if (activeNear === 3) {
                        setPoint(newG, x, y, z, '#');
                    }

                }
            }
        }

        return newG;
    };

    times(6, () => {
        G = cycle(G);
    });

    let ans = 0;
    forEachG(G, (x, y, z, c) => {
        if (c === '#') ans++;
    });

    return ans;
}

function runB(input: Input) {
    const arrayToEntries = <T>(a: T[]) => a.map((v, k) => ([k, v]));
    const arrToObj = <T>(line: T[]) => fromPairs(arrayToEntries(line));

    let G = arrToObj([arrToObj([arrToObj(input.map(arrToObj))])]);

    const forEachG = (g: typeof G, cb: (x: number, y: number, z: number, w: number, c: string) => any) => {
        Object.entries(g).forEach(
            ([w, d3]) => {
                Object.entries(d3).forEach(
                    ([z, plane]) => {
                        Object.entries(plane).forEach(
                            ([y, line]) => {
                                Object.entries(line).forEach(
                                    ([x, char]) => {
                                        cb(Number(x), Number(y), Number(z), Number(w), char as string);
                                    },
                                );
                            },
                        );
                    },
                )
            }
        )
    };

    const getPoint = (g: typeof G, x: number, y: number, z: number, w: number) => g?.[w]?.[z]?.[y]?.[x];
    const setPoint = (g: typeof G, x: number, y: number, z: number, w: number, c: string) => {
        g[w] = g[w] || {};
        g[w][z] = g[w][z] || {};
        g[w][z][y] = g[w][z][y] || {};
        g[w][z][y][x] = c;
    };

    const cycle = (g: typeof G): typeof G => {
        const newG: typeof G = {};

        const activePoints: [number, number, number, number][] = [];
        forEachG(G, (x, y, z, w, c) => {
            if (c === '#') activePoints.push([x, y, z, w]);
        });

        const pRange = (n: number) => {
            const coord = activePoints.map(p => p[n]);
            return range(Math.min(...coord) - 1, Math.max(...coord) + 1 + 1);
        };

        const dd = [-1, 0, 1];

        for (const w of pRange(3)) {
            for (const z of pRange(2)) {
                for (const y of pRange(1)) {
                    for (const x of pRange(0)) {

                        let activeNear = 0;
                        for (const dw of dd) {
                            for (const dz of dd) {
                                for (const dy of dd) {
                                    for (const dx of dd) {
                                        if (dx === 0 && dy === 0 && dz === 0 && dw === 0) continue;
                                        if (getPoint(g, x + dx, y + dy, z + dz, w + dw) === '#') activeNear++;
                                    }
                                }
                            }
                        }

                        const curr = getPoint(g, x, y, z, w);

                        //If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
                        // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
                        if (curr === '#' && activeNear >= 2 && activeNear <= 3) {
                            setPoint(newG, x, y, z, w, '#');
                        } else if (activeNear === 3) {
                            setPoint(newG, x, y, z, w, '#');
                        }

                    }
                }
            }
        }

        return newG;
    };

    times(6, () => {
        G = cycle(G);
    });

    let ans = 0;
    forEachG(G, (x, y, z, w, c) => {
        if (c === '#') ans++;
    });

    return ans;
}

assert.equal(112, runA(prepareInput(`.#.
..#
###`)));
assert.equal(848, runB(prepareInput(`.#.
..#
###`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
