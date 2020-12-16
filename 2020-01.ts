import get from './api';
import assert from 'assert';
import { splitLines } from './utils';

function runA(data: string): number {
    const arr = splitLines(data).map(n => Number(n)).sort((a, b) => a - b);
    let l = 0, r = arr.length - 1;
    const sum = 2020;

    while (l < r - 1) {
        if (arr[l] + arr[r] == sum) {
            return arr[l] * arr[r];
        } else if (arr[l] + arr[r] < sum) {
            l += 1;
        } else {
            r -= 1;
        }
    }
}

function runB(data: string): number {
    const a = splitLines(data).map(n => Number(n)).sort((a, b) => a - b);
    let l = 0, r = a.length - 1;
    const sum = 2020;

    for (let l = 0; l < a.length; l++) {
        for (let m = l + 1; m < a.length; m++) {
            for (let r = m + 1; r < a.length; r++) {
                if (a[l] + a[m] + a[r] === 2020) {
                    return a[l] * a[m] * a[r];
                }
            }
        }
    }
}

assert.equal(514579, runA(`1721
979
366
299
675
1456`));

const run = async () => {
    const data = await get('2020/day/1/input');
    console.log(runA(data));
    console.log(runB(data));
};

if (require.main === module) {
    run();
}
