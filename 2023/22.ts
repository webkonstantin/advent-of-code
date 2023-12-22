import * as assert from 'assert';
import { getInput } from './get-input';
import memo from 'memoizee';
import { uniq } from 'lodash-es';

type Point2 = [number, number];
type Point3 = [number, number, number];

const p = memo((x: number, y: number, z: number) => [x, y, z] as Point3);

function part1(input: string) {
    // const space = new Set<Point>();
    // let addToSpace = function (b: [number, number, number], a: [number, number, number]) {
    //     const vec = p(
    //         Math.sign(b[0] - a[0]),
    //         Math.sign(b[1] - a[1]),
    //         Math.sign(b[2] - a[2]),
    //     );
    //     let curr = a;
    //     while (curr[0] !== b[0] || curr[1] !== b[1] || curr[2] !== b[2]) {
    //         space.add(curr);
    //         curr = p(curr[0] + vec[0], curr[1] + vec[1], curr[2] + vec[2]);
    //     }
    //     space.add(curr);
    // };

    const bricks = input.split('\n').map((line, i) => {
        const [a, b] = line.split('~').map(xyz => p(...xyz.split(',').map(Number) as Point3));
        const points = [a, b] as [Point3, Point3];
        // @ts-ignore
        points.char = String.fromCharCode(65 + i);
        return points;
    });
    const bc = (i: number | string) => bricks[Number(i)].char;
    // console.log(bricks);
    bricks.sort((b1, b2) => {
        const minZ1 = Math.min(b1[0][2], b1[1][2]);
        const minZ2 = Math.min(b2[0][2], b2[1][2]);
        return minZ1 - minZ2;
    });
    // console.log(bricks);

    function* iterXY(a: Point3, b: Point3) {
        const [dx, dy] = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];
        let [x, y] = [a[0], a[1]];
        while (x !== b[0] || y !== b[1]) {
            yield [x, y] as Point2;
            x += dx;
            y += dy;
        }
        yield [x, y] as Point2;
    }

    const elevation = {} as Record<string, number>; // x,y -> elevation
    const topBricks = {} as Record<string, number>; // x,y -> brick index
    const supports = {} as Record<number, Set<number>>; // brick index -> brick indexes

    const key2 = (x: number, y: number) => `${x},${y}`;


    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        const [a, b] = brick;
        const isHorizontal = a[2] === b[2];

        if (isHorizontal) {
            const xyPoints = [...iterXY(a, b)];
            const maxElevation = Math.max(...xyPoints.map(
                ([x, y]) => elevation[key2(x, y)] || 0,
            ));
            if (maxElevation > 0) {
                // find points that are at maxElevation
                const topPoints = xyPoints.filter(
                    ([x, y]) => elevation[key2(x, y)] === maxElevation,
                );
                // get top bricks for top points
                const tb = topPoints.map(
                    ([x, y]) => topBricks[key2(x, y)],
                );
                // current brick is supported by all top bricks
                for (const topBrick of tb) {
                    if (topBrick === undefined) continue;
                    supports[topBrick] = supports[topBrick] || new Set<number>();
                    supports[topBrick].add(i);
                }
            }
            // update elevation and topBricks
            xyPoints.forEach(([x, y]) => {
                elevation[key2(x, y)] = maxElevation + 1;
                topBricks[key2(x, y)] = i;
            });
        } else {
            // vertical
            const [x, y] = a;
            const maxElevation = elevation[key2(x, y)] || 0;
            const topBrick = topBricks[key2(x, y)];
            if (maxElevation > 0 && topBrick !== undefined) {
                // current brick is supported by top brick
                supports[topBrick] = supports[topBrick] || new Set<number>();
                supports[topBrick].add(i);
            }
            // update elevation and topBricks
            const brickSize = Math.abs(a[2] - b[2]) + 1;
            elevation[key2(x, y)] = maxElevation + brickSize;
            topBricks[key2(x, y)] = i;
        }
        // addToSpace(b, a);
    }
    // console.log(space.size);

    // const points = bricks.flat();
    // const xx = points.map(p => p[0]);
    // console.log(Math.max(...xx), Math.min(...xx));
    // const yy = points.map(p => p[1]);
    // console.log(Math.max(...yy), Math.min(...yy));

    // console.log({ elevation, topBricks, supports });

    for (const [k, v] of Object.entries(supports)) {
        console.log(`brick ${bc(k)} supports bricks ${[...v].map(bc).join(', ')}`);
        // console.log(k, v);
    }

    const supportedBy = {} as Record<number, Set<number>>; // brick index -> brick indexes
    for (const [k, v] of Object.entries(supports)) {
        for (const brick of v) {
            supportedBy[brick] = supportedBy[brick] || new Set<number>();
            supportedBy[brick].add(Number(k));
        }
    }
    console.log(supportedBy);

    let ans = 0;
    for (let i = 0; i < bricks.length; i++) {
        const thisBrickSupports = supports[i] ? [...supports[i]] : [];
        if (thisBrickSupports.every((supportedBrick) => {
            // supported by other bricks
            return supportedBy[supportedBrick]?.size > 1;
        })) {
            ans += 1;
        }
    }
    // 666 too high
    // 472 too high
    return ans;
}

function part2(input: string) {
}

const input = await getInput(22);

const sample = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`.trim();

assert.equal(part1(sample), 5);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
