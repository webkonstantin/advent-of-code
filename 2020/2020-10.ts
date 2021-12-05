import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';

const day = '10';

function prepareInput(input: string) {
    return splitLines(input).map(Number).sort((a, b) => a - b);
}

// number of 1-jolt differences multiplied by the number of 3-jolt differences
function runA(nums: Input) {
    const counts: Record<number, number> = {};
    nums.forEach((num, i) => {
        const prev = i > 0 ? nums[i - 1] : 0;
        const diff = num - prev;
        counts[diff] = (counts[diff] || 0) + 1;
    });
    counts[3] = (counts[3] || 0) + 1;
    return counts[1] * counts[3];
}

// number of distinct ways you can arrange the adapters to connect the charging outlet to your device
function runB(nums: Input) {
    const dp: number[] = [1];
    nums.forEach((num, i) => {
        dp[num] =
            (dp[num - 1] || 0) +
            (dp[num - 2] || 0) +
            (dp[num - 3] || 0);
    });
    const max = nums[nums.length - 1];
    return dp[max];
}

// 19 + 3 = 22
// 7 differences of 1 jolt and 5 differences of 3 jolts.
assert.equal(7 * 5, runA(prepareInput(`16
10
15
5
1
11
7
19
6
12
4`)));
assert.equal(22 * 10, runA(prepareInput(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`)));
assert.equal(8, runB(prepareInput(`16
10
15
5
1
11
7
19
6
12
4`)));
assert.equal(19208, runB(prepareInput(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = prepareInput(await get(`2020/day/${day}/input`));

    console.log(runA(input));
    console.log(runB(input));
};

if (require.main === module) {
    run().catch(console.error);
}
