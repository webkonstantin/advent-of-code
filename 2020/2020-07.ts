import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '7';

interface Color {
    contains: Record<string, number>;
    containedBy: Set<string>;
}

function getNewColor(): Color {
    return {
        contains: {},
        containedBy: new Set(),
    };
}

function prepareInput(input: string) {
    const colors: Record<string, Color> = {};
    splitLines(input).forEach(l => {
        const [color, contains] = l.split(' bags contain ');
        colors[color] = colors[color] || getNewColor();
        contains.split(',').map(b => {
            const m = b.match(/^ ?(\d+) (\w+ \w+)/);
            if (!m) return;
            const [, n, c] = m;
            colors[c] = colors[c] || getNewColor();
            colors[c].containedBy.add(color);
            colors[color].contains[c] = Number(n);
        });
    });
    return colors;
}

const bag = 'shiny gold';

function runA(input: Input) {
    const a = new Set<string>();
    const q: string[] = [bag];
    while (q.length) {
        const b = q.shift();
        const cb = [...input[b].containedBy.keys()];
        cb.forEach(cbi => a.add(cbi));
        q.push(...cb);
    }
    return a.size;
}

function runB(input: Input) {
    let sum = 0;
    const add = (c: string, num = 1) => {
        Object.entries(input[c].contains).forEach(([cc, n]) => {
            sum += num * n;
            add(cc, num * n);
        });
    };
    add(bag);
    return sum;
}

assert.equal(4, runA(prepareInput(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`)));
assert.equal(32, runB(prepareInput(`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`)));
assert.equal(126, runB(prepareInput(`shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`)));
// assert.equal(0, runB(prepareInput(``)));

// assert.equal(0, runA(prepareInput(``)));
// assert.equal(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
