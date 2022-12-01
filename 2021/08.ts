import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { intersection } from 'lodash';

const day = '8';

function prepareInput(input: string) {
    return splitLines(input);
}

function runA(input: Input) {
    let a = 0;
    for (let line of input) {
        let [, o] = line.split(' | ');
        console.log(o);
        for (let d of o.split(' ')) {
            a += Number(d.length === 2 || d.length === 4 || d.length === 3 || d.length === 7);
        }
    }
    return a;
}

const digits = [
    'abcefg',
    'cf',
    'acdeg',
    'acdfg',
    'bcdf',
    'abdfg',
    'abdefg',
    'acf',
    'abcdefg',
    'abcdfg',
];

function runB(input: Input) {
    let a = 0;
    // const canBe = {
    //     'a': new Set('abcdefg'),
    //     'b': new Set('abcdefg'),
    //     'c': new Set('abcdefg'),
    //     'd': new Set('abcdefg'),
    //     'e': new Set('abcdefg'),
    //     'f': new Set('abcdefg'),
    //     'g': new Set('abcdefg'),
    // }
    for (let line of input) {
        const canBe = {
            'a': ('abcdefg').split(''),
            'b': ('abcdefg').split(''),
            'c': ('abcdefg').split(''),
            'd': ('abcdefg').split(''),
            'e': ('abcdefg').split(''),
            'f': ('abcdefg').split(''),
            'g': ('abcdefg').split(''),
        }
        let [p, o] = line.split(' | ');
        for (let d of p.split(' ')) {
            // @ts-ignore
            let cb = [];
            for (let dd of digits) {
                if (dd.length === d.length) {
                    // @ts-ignore
                    cb = cb.concat(dd.split(''));
                }
            }
            for (let c of d) {
                // @ts-ignore
                canBe[c] = intersection(canBe[c], [...new Set(cb)]);
            }
        }
        console.log(p, canBe);
    }
    return a;
}

// assert.strictEqual(26, runA(prepareInput(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb |
// fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec |
// fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef |
// cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega |
// efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga |
// gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf |
// gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf |
// cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd |
// ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg |
// gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc |
// fgae cfgab fg bagce`)));
// assert.strictEqual(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    // console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
