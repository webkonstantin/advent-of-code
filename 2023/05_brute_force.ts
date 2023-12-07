import * as fs from 'fs';
import * as assert from 'assert';
import { chunk } from 'lodash-es';
import { SingleBar } from 'cli-progress';
import * as workerpool from 'workerpool';

function part1(input: string) {
    const [seeds, ...maps] = input.trim().split('\n\n');
    const map = (seed: number) => {
        for (const map of maps) {
            const [name, ...lines] = map.split('\n');
            for (const [dst, src, len] of lines.map(line => line.split(' ').map(Number))) {
                if (seed >= src && seed < src + len) {
                    seed += dst - src;
                    break;
                }
            }
        }
        return seed;
    };
    return Math.min(...seeds.split(': ')[1].split(' ').map(Number).map(map));
}


let getMin = function (begin: number, end: number, maps: number[][][]) {
    let min = Infinity;
    for (let s = begin; s < end; s++) {
        let seed = s;
        for (const map of maps) {
            for (const [dst, src, len, diff, srcEnd] of map) {
                if (seed >= src && seed < srcEnd) {
                    seed += diff;
                    break;
                }
            }
        }
        min = Math.min(min, seed);
    }
    return min;
};

let sleep = function (timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

async function part2(input: string) {
    const [seeds_, ...maps_] = input.trim().split('\n\n');
    const maps = maps_.map(map => {
        const [name, ...lines] = map.split('\n');
        return lines.map(line => {
            const arr = line.split(' ').map(Number);
            const [dst, src, len] = arr;
            const diff = dst - src;
            const srcEnd = src + len;
            arr.push(diff, srcEnd);
            return arr;
        });
    });
    let min = Infinity;
    const pool = workerpool.pool();
    const seeds = seeds_.split(': ')[1].split(' ').map(Number);
    const size = 1e6;
    for (const [begin, len] of chunk(seeds, 2)) {
        // console.log('input', [begin, len]);
        const end = begin + len;
        for (let l = begin; l < end; l += size) {
            const args = [l, Math.min(l + size, end), maps] as const;
            // console.log(args.slice(0, 2));
            pool.exec(getMin, args as any).then(m => {
                min = Math.min(min, m);
            });
        }
    }
    let stats = pool.stats();
    const progress = new SingleBar({});
    const total = stats.pendingTasks;
    progress.start(total, 0);
    while (stats.pendingTasks > 0) {
        stats = pool.stats();
        progress.update(total - stats.pendingTasks);
        await sleep(200);
    }
    progress.stop();
    await pool.terminate();
    return min;
}

const sample = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.trim();

assert.equal(part1(sample), 35);
assert.equal(await part2(sample), 46);

const input = fs.readFileSync('input05.txt', 'utf8');

console.log(part1(input));
console.log(await part2(input));
