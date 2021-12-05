import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { fromPairs, range, sortBy, sum } from 'lodash';
import memoize from 'memoizee';

const day = '16';

function prepareInput(input: string) {
    let [rules_, my_, nearby_] = input.split('\n\n').map(l => splitLines(l));
    let rules = fromPairs(rules_.map(r => {
        const [field, ranges_] = r.split(': ');
        const ranges = ranges_.split(' or ').map(ra => ra.split('-').map(Number));
        return [field, ranges];
    }));
    const my = my_[1].split(',').map(Number);
    const nearby = nearby_.slice(1).map(t => t.split(',').map(Number));
    return { rules, my, nearby };
}

function isValid(rules: number[][], n: number) {
    return rules.some(([min, max]) => min <= n && max >= n);
}

function runA(input: Input) {
    const allRules = Object.values(input.rules);

    // Sum invalid fields
    return sum(input.nearby
        .map(ticket => ticket.filter(n => {
            return !allRules.some(rules => isValid(rules, n));
        }))
        .flat(),
    );
}

type Key = keyof Input['rules'];

function matchFields(input: Input) {
    const allRules = Object.values(input.rules);
    const validNearby = input.nearby.filter(ticket => {
        return ticket.every(v => {
            return allRules.some(rules => isValid(rules, v));
        });
    });

    const canBe = memoize((index: number, key: string) => validNearby
        .map(t => t[index])
        .every(n => isValid(input.rules[key], n)));

    const length = allRules.length;

    // Fields that can match less positions go first
    const keys = sortBy(
        Object.keys(input.rules),
        key => range(length).map(i => canBe(i, key)).filter(Boolean).length,
    );

    const fields: Key[] = [];

    function go(): Key[] | void {
        if (fields.length === length) return fields;
        for (const key of keys) {
            if (fields.includes(key)) continue;
            if (canBe(fields.length, key)) {
                fields.push(key);
                if (go()) {
                    return fields;
                } else {
                    fields.pop();
                }
            }
        }
    }

    return go() as Key[];
}

function runB(input: Input) {
    const fields = matchFields(input);

    let ans = 1;
    input.my.forEach((val, i) => {
        // @ts-ignore
        if (fields[i].startsWith('departure')) {
            ans *= val;
        }
    });

    return ans;
}

assert.equal(71, runA(prepareInput(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`)));

assert.deepEqual(['row', 'class', 'seat'], matchFields(prepareInput(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
