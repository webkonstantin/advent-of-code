import * as assert from 'assert';
import { getInput } from './get-input';

function part1(input: string) {
    const [instructions, nodes] = input.split('\n\n');
    const map = Object.fromEntries(nodes.split('\n').map(n => {
        const [key, L, R] = n.match(/\w{3}/g);
        return [key, { L, R }];
    }));
    let curr = 'AAA';
    let i = 0;
    while (curr !== 'ZZZ') {
        curr = map[curr][instructions[i % instructions.length] as 'L' | 'R'];
        i++;
    }
    return i;
}

function gcd(a: number, b: number) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

function lcm(a: number, b: number) {
    return (a * b) / gcd(a, b);
}

function part2(input: string) {
    const [instructions, nodes] = input.split('\n\n');
    const map = Object.fromEntries(nodes.split('\n').map(n => {
        const [key, L, R] = n.match(/\w{3}/g);
        return [key, { L, R }];
    }));

    const findCycles = (curr: string, i = 0, pos = 0) => {
        const visited = new Map<string, number>();
        const zs = [];
        while (!visited.has(`${curr},${pos}`)) {
            visited.set(`${curr},${pos}`, i);
            curr = map[curr][instructions[pos] as 'L' | 'R'];
            i++;
            pos = i % instructions.length;
            if (curr.endsWith('Z')) {
                zs.push(i);
            }
        }
        // console.log(`${curr},${pos}`, visited);
        let start = visited.get(`${curr},${pos}`);
        let len = i - start;
        // console.log({ start, len, zs });
        return { start, len, zs };
    };

    let nums = [];
    let curr = Object.keys(map).filter(k => k.endsWith('A'))!;
    for (const c of curr) {
        nums.push(findCycles(c).zs[0]);
    }
    return nums.reduce(lcm);
}

const sample = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trim();

assert.equal(part1(sample), 6);
assert.equal(part2(`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`), 6);

const input = await getInput(8);

console.log(part1(input));
console.log(part2(input));
