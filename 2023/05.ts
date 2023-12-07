import * as fs from 'fs';
import * as assert from 'assert';
import { chunk } from 'lodash-es';
import { SingleBar } from 'cli-progress';

// Seed number 79 corresponds to soil number 81.
// Seed number 14 corresponds to soil number 14.
// Seed number 55 corresponds to soil number 57.
// Seed number 13 corresponds to soil number 13.

// Seed 79, soil 81, fertilizer 81, water 81, light 74,
// temperature 78, humidity 78, location 82.

function part1(input: string) {
    // lowest location number
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

function part2(input: string) {
    const [seeds_, ...maps_] = input.trim().split('\n\n');
    const maps = maps_.map(map => {
        const [name, ...lines] = map.split('\n');
        return lines.map(line => line.split(' ').map(Number));
    });
    let min = Infinity;
    let seed;
    const seeds = seeds_.split(': ')[1].split(' ').map(Number);
    for (const [begin, len] of chunk(seeds, 2)) {
        console.log([begin, len]);
        const pb = new SingleBar({});
        pb.start(len, begin);
        for (let s = begin; s < begin + len; s++) {
            seed = s;
            for (const map of maps) {
                for (const [dst, src, len] of map) {
                    if (seed >= src && seed < src + len) {
                        seed += dst - src;
                        break;
                    }
                }
            }
            min = Math.min(min, seed);
            pb.update(s);
        }
        pb.stop();
    }
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
assert.equal(part2(sample), 46);

const input = fs.readFileSync('input05.txt', 'utf8');

console.log(part1(input));
console.log(part2(input));
