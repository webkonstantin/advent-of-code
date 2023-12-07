import { range } from 'lodash-es';

function part1() {
    // const times = [71530];
    // const dists = [940200];
    const times = [44899691];
    const dists = [277113618901768];
    console.log(times.map((t, i) => {
        const d = dists[i];
        // console.log('dt', d, t);
        return range(1, t + 1).filter(v => {
            const tt = t - v;
            const dist = v * tt;
            return dist > d;
        }).length;
    }).reduce(
        (a, b) => a * b,
    ));
}

function part2(input: string) {

}

const sample = ``.trim();

// assert.equal(part1(sample), 35);
// assert.equal(part2(sample), 46);

// const input = fs.readFileSync('input05.txt', 'utf8');
const input = {
    time: [44, 89, 96, 91],
    dist: [277, 1136, 1890, 1768],
};

console.log(part1());
// console.log(part2(input));
