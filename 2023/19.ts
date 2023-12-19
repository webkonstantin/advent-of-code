import * as assert from 'assert';
import { getInput } from './get-input';
import { sum } from 'lodash-es';

const parseInput = function (input: string) {
    const [workflows_, parts_] = input.split('\n\n');
    const parts = parts_.split('\n').map(p => {
        // let part;
        // eval('part = ' + p.replaceAll('=', ':'));
        // return part;
        const part: Record<string, number> = {};
        p.slice(1, -1).split(',').forEach(kv => {
            const [key, val] = kv.split('=');
            part[key] = parseInt(val);
        });
        return part;
    });
    const workflows = Object.fromEntries(workflows_.split('\n').map(w => {
        const [name, conditions_] = w.split('{');
        const conditions = conditions_.slice(0, -1).split(',').map(c => {
            const [condition, action] = c.split(':');
            return [condition, action];
        });
        return [name, conditions];
    }));
    return { parts, workflows };
};

function part1(input: string) {
    const { parts, workflows } = parseInput(input);
    return sum(parts.map(p => {
        const { x, m, a, s } = p;
        const checkCond = (cond: string) => {
            const m = cond.match(/^(\w)([<>])(\d+)$/)!;
            const [_, key, op, val_] = m;
            const val = parseInt(val_);
            if (op === '<') {
                return p[key] < val;
            } else if (op === '>') {
                return p[key] > val;
            }
        };
        let action = 'in';
        while (action !== 'R' && action !== 'A') {
            for (let [cond, nextAction] of workflows[action]) {
                if (!nextAction) {
                    action = cond;
                    break;
                }
                if (checkCond(cond)) { // eval(cond) also works
                    action = nextAction;
                    break;
                }
            }
        }
        return action === 'A'
            ? x + m + a + s
            : 0;
    }));
}

function part2(input: string) {
    const { workflows } = parseInput(input);
    // find all paths from in to A and collect conditions along the way
    const paths = [];
    const conditions = [];
    const dfs = (action = 'in') => {
        if (action === 'A') {
            paths.push(conditions.slice());
            return;
        }
        if (action === 'R') return;
        const len = conditions.length;
        for (let [cond, nextAction] of workflows[action]) {
            // always match
            if (!nextAction) {
                nextAction = cond;
                dfs(nextAction);
                break;
            }
            // assume match
            conditions.push(cond);
            dfs(nextAction);
            conditions.pop();
            // and not match
            conditions.push(`!${cond}`);
        }
        conditions.length = len;
    };
    dfs();
    return sum(paths.map(path => {
        const ranges = {
            x: [1, 4001],
            m: [1, 4001],
            a: [1, 4001],
            s: [1, 4001],
        };
        for (const cond of path) {
            // !x<1000
            const m = cond.match(/^(!)?(\w)([<>])(\d+)$/)!;
            const [_, neg, key, op, val_] = m;
            const val = parseInt(val_);
            const [min, max] = ranges[key];
            if (!neg) {
                if (op === '<') {
                    ranges[key] = [min, Math.min(max, val)];
                } else if (op === '>') {
                    ranges[key] = [Math.max(min, val + 1), max];
                }
            } else {
                if (op === '<') { // >=
                    ranges[key] = [Math.max(min, val), max];
                } else if (op === '>') { // <=
                    ranges[key] = [min, Math.min(max, val + 1)];
                }
            }
        }
        return Object.values(ranges)
            .map(([min, max]) => max - min)
            .reduce((a, b) => a * b);
    }));
}

const input = await getInput(19);

const sample = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`.trim();

assert.equal(part1(sample), 19114);
assert.equal(part2(sample), 167409079868000);

console.log(part1(input));
console.log(part2(input));
