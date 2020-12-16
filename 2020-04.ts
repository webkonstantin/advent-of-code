import assert from 'assert';
import { fromPairs } from 'lodash';
import get from './api';

function runA(data: string) {
    return data.split(/\n\n/).filter(p => {
        const passport = fromPairs(p.split(/[\n ]/).map(f => f.split(':')));
        return [
            'byr', // (Birth Year)
            'iyr', // (Issue Year)
            'eyr', // (Expiration Year)
            'hgt', // (Height)
            'hcl', // (Hair Color)
            'ecl', // (Eye Color)
            'pid', // (Passport ID)
            // 'cid', // (Country ID)
        ].every(key => passport[key]);
    }).length;
}

function runB(data: string) {
    const validate = {
        // (Birth Year) - four digits; at least 1920 and at most 2002.
        byr: (val: string) => {
            const n = parseInt(val);
            return /^\d{4}$/.test(val) && n >= 1920 && n <= 2002;
        },
        // (Issue Year) - four digits; at least 2010 and at most 2020.
        iyr: (val: string) => {
            const n = parseInt(val);
            return /^\d{4}$/.test(val) && n >= 2010 && n <= 2020;
        },
        // (Expiration Year) - four digits; at least 2020 and at most 2030.
        eyr: (val: string) => {
            const n = parseInt(val);
            return /^\d{4}$/.test(val) && n >= 2020 && n <= 2030;
        },
        // (Height) - a number followed by either cm or in:
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        hgt: (val: string) => {
            const n = parseInt(val);
            return (
                /^\d+cm$/.test(val) && n >= 150 && n <= 193 ||
                /^\d+in$/.test(val) && n >= 59 && n <= 76
            );
        },
        // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        hcl: (val: string) => /^#[\da-f]{6}$/.test(val),
        // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        ecl: (val: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
        // (Passport ID) - a nine-digit number, including leading zeroes.
        pid: (val: string) => /^\d{9}$/.test(val),
    };

    return data.split(/\n\n/).filter(p => {
        const passport = fromPairs(p.split(/[\n ]/).map(f => f.split(':')));
        return Object.entries(validate).every(([key, validator]) => validator(passport[key]));
    }).length;
}

assert.equal(2, runA(`ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`));

assert.equal(0, runB(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`));

assert.equal(4, runB(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`));

const run = async () => {
    const data = await get('2020/day/4/input');

    console.log(runA(data));
    console.log(runB(data));
};

if (require.main === module) {
    run();
}
