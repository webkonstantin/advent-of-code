import * as assert from 'assert';
import { getInput } from './get-input';
import memo from 'memoizee';

const DIRS = [
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
    [0, -1], // up
];

const graphVertex = memo((x: number, y: number, dir: number, stepsDir: number) => (
    { x, y, dir, stepsDir }
));

type GraphVertex = ReturnType<typeof graphVertex>;

function part1(input: string) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split('').map(Number));
    const [W, H] = [G[0].length, G.length];
    // console.log({ W, H });

    const minPaths = new Map<GraphVertex, number>();
    let level = [
        graphVertex(0, 0, 0, 0),
        graphVertex(0, 0, 1, 0),
    ];
    let minPath = Infinity;
    minPaths.set(level[0], 0);
    minPaths.set(level[1], 0);
    const getNextVertices = (vertex: GraphVertex) => {
        const nextVertices: GraphVertex[] = [];
        const isInBounds = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H;
        if (vertex.stepsDir < 3) {
            // go same direction
            const [dx, dy] = DIRS[vertex.dir];
            const [x, y] = [vertex.x + dx, vertex.y + dy];
            nextVertices.push(graphVertex(x, y, vertex.dir, vertex.stepsDir + 1));
        }
        // go left
        const left = (vertex.dir + 3) % 4;
        const [ldx, ldy] = DIRS[left];
        nextVertices.push(graphVertex(vertex.x + ldx, vertex.y + ldy, left, 1));
        // go right
        const right = (vertex.dir + 1) % 4;
        const [rdx, rdy] = DIRS[right];
        nextVertices.push(graphVertex(vertex.x + rdx, vertex.y + rdy, right, 1));

        return nextVertices.filter(({ x, y }) => isInBounds(x, y));
    };
    while (level.length) {
        const newLevel = new Set<GraphVertex>();
        for (const vertex of level) {
            for (const nextVertex of getNextVertices(vertex)) {
                const costToNext = minPaths.get(vertex) + G[nextVertex.y][nextVertex.x];
                const currentCost = minPaths.has(nextVertex) ? minPaths.get(nextVertex) : Infinity;
                if (costToNext < currentCost) {
                    minPaths.set(nextVertex, costToNext);
                    if (nextVertex.x === W - 1 && nextVertex.y === H - 1) {
                        minPath = Math.min(minPath, costToNext);
                    }
                    newLevel.add(nextVertex);
                }
            }
        }
        level = [...newLevel.values()];
    }
    return minPath;
}

function part2(input: string) {
    const lines = input.split('\n');
    const G = lines.map(line => line.split('').map(Number));
    const [W, H] = [G[0].length, G.length];
    // console.log({ W, H });

    const minPaths = new Map<GraphVertex, number>();
    let level = [
        graphVertex(0, 0, 0, 0),
        graphVertex(0, 0, 1, 0),
    ];
    let minPath = Infinity;
    minPaths.set(level[0], 0);
    minPaths.set(level[1], 0);
    const getNextVertices = (vertex: GraphVertex) => {
        const nextVertices: [GraphVertex, number][] = [];
        const isInBounds = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H;
        if (vertex.stepsDir < 10) {
            let steps = vertex.stepsDir;
            const [dx, dy] = DIRS[vertex.dir];
            let [x, y] = [vertex.x + dx, vertex.y + dy];
            let cost = G[y]?.[x];
            while (steps < 3) {
                x += dx;
                y += dy;
                cost += G[y]?.[x];
                steps++;
            }
            nextVertices.push([
                graphVertex(x, y, vertex.dir, steps + 1),
                cost,
            ]);
        }
        if (vertex.stepsDir >= 4) {
            // go left
            const left = (vertex.dir + 3) % 4;
            const [ldx, ldy] = DIRS[left];
            nextVertices.push([
                graphVertex(vertex.x + ldx, vertex.y + ldy, left, 1),
                G[vertex.y + ldy]?.[vertex.x + ldx],
            ]);
            // go right
            const right = (vertex.dir + 1) % 4;
            const [rdx, rdy] = DIRS[right];
            nextVertices.push([
                graphVertex(vertex.x + rdx, vertex.y + rdy, right, 1),
                G[vertex.y + rdy]?.[vertex.x + rdx],
            ]);
        }

        return nextVertices.filter(([{ x, y }]) => isInBounds(x, y));
    };
    while (level.length) {
        // console.log(level.length);
        const newLevel = new Set<GraphVertex>();
        for (const vertex of level) {
            for (const [nextVertex, addCostToNext] of getNextVertices(vertex)) {
                const costToNext = minPaths.get(vertex) + addCostToNext;
                const currentCost = minPaths.has(nextVertex) ? minPaths.get(nextVertex) : Infinity;
                if (costToNext < currentCost) {
                    minPaths.set(nextVertex, costToNext);
                    if (nextVertex.x === W - 1 && nextVertex.y === H - 1) {
                        minPath = Math.min(minPath, costToNext);
                    }
                    newLevel.add(nextVertex);
                }
            }
        }
        level = [...newLevel.values()];
    }
    return minPath;
}

const input = await getInput(17);

const sample = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim();

assert.equal(part1(sample), 102);
assert.equal(part2(sample), 94);

console.log(part1(input));
console.log(part2(input));
