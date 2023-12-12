import * as assert from 'assert';
import { getInput } from './get-input';
import { sum } from 'lodash-es';

const getCount2 = (arr: string, groups: number[]) => {
    // recursive
    // const m = arr.match(/([\?#]+)/g);
    // console.log(arr, m);

    console.log(arr, groups);
    if (groups.length === 0) return Number(arr.indexOf('#') === -1);
    const m = arr.match(/\?|#/);
    if (!m) return 0;

    const char = m[0];
    const i = m.index;
    console.log({ char, i, arr });
    arr = arr.slice(i);
    console.log({ arr });

    if (char === '#') {
        // ensure that the group is valid
        const requiredGroupLength = groups[0];
        const group = arr.substr(i, requiredGroupLength);
    }

    return 0;
};

const getCount = (arr: string, groups: number[]) => {
    const a = arr.split('');
    let count = 0;
    const go = (i = 0) => {
        if (i === a.length) {
            const re = new RegExp(
                '^\\.*' +
                groups.map(g => `#{${g}}`).join('\\.+')
                + '\\.*$'
            );
            const m = a.join('').match(re);
            if (m) {
                count++;
                // console.log(a.join(''), { re, m });
            }
            return;
        }
        if (a[i] === '?') {
            a[i] = '#';
            go(i + 1);
            a[i] = '.';
            go(i + 1);
            a[i] = '?';
        } else {
            go(i + 1);
        }
    };
    go();
    return count;
};

function part1(input: string) {
    const lines = input.split('\n').map(line => {
        const [arr, groups_] = line.split(' ');
        const groups = groups_.split(',').map(Number);
        const count = getCount(arr, groups);
        return { arr, groups, count };
    });
    // console.log(lines);
    return sum(lines.map(line => line.count));
}

// function part2(input: string) {
//     const lines = input.split('\n').map(line => {
//         const [arr, groups_] = line.split(' ');
//         const groups = groups_.split(',').map(Number);
//         const count = getCount2(arr, groups);
//         return { arr, groups, count };
//     });
//     // console.log(lines);
//     return sum(lines.map(line => line.count));
// }

const input = await getInput(12);

const sample = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim();

assert.equal(part1('?###???????? 3,2,1'), 10);
assert.equal(part1(sample), 21);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
