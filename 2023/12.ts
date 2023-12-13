import * as assert from 'assert';
import { getInput } from './get-input';
import { sum } from 'lodash-es';

const getCountSlow = (str: string, groups: number[]) => {
    const arr = str.split('');
    let count = 0;
    const backtrack = (i = 0) => {
        if (i === arr.length) {
            const re = new RegExp(`^\\.*${groups.map(g => `#{${g}}`).join('\\.+')}\\.*$`);
            if (arr.join('').match(re)) count++;
            return;
        }
        if (arr[i] === '?') {
            arr[i] = '#';
            backtrack(i + 1);
            arr[i] = '.';
            backtrack(i + 1);
            arr[i] = '?';
        } else {
            backtrack(i + 1);
        }
    };
    backtrack();
    return count;
};

const getCountFast = (str: string, groups: number[]) => {
    const cache = new Map<string, number>();
    const dp = (strIndex = 0, groupsIndex = 0) => {
        const key = `${strIndex},${groupsIndex}`;
        if (cache.has(key)) return cache.get(key);
        if (groupsIndex === groups.length) {
            return Number(str.indexOf('#', strIndex) === -1);
        }
        const groupLength = groups[groupsIndex];
        let dotsInWindow = 0;
        let count = 0;
        let l = strIndex;
        for (let r = strIndex; r < str.length; r++) {
            str[r] === '.' && dotsInWindow++;
            const windowLength = r - l + 1;
            if (windowLength < groupLength) continue;
            if (str[r + 1] !== '#' && dotsInWindow === 0) {
                count += dp(r + 2, groupsIndex + 1);
            }
            if (str[l] === '#') break;
            str[l] === '.' && dotsInWindow--;
            l++;
        }
        cache.set(key, count);
        return count;
    };
    return dp();
};

function part1(input: string) {
    return sum(input.split('\n').map(line => {
        const [str, groups] = line.split(' ');
        return getCountFast(str, groups.split(',').map(Number));
    }));
}

function part2(input: string) {
    return sum(input.split('\n').map(line => {
        const [str, groups] = line.split(' ');
        const groups5 = Array(5).fill(groups).join(',');
        const str5 = Array(5).fill(str).join('?');
        return getCountFast(str5, groups5.split(',').map(Number));
    }));
}

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
assert.equal(part2(sample), 525152);

console.log(part1(input));
console.log(part2(input));
