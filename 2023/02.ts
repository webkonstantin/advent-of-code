import * as fs from 'fs';
import { sum } from 'lodash-es';

let input = fs.readFileSync('input02.txt', 'utf8');
let lines = input.split('\n').filter(Boolean);

// Part 1
const cubes = {
    red: 12,
    green: 13,
    blue: 14,
};
console.log(sum(
    lines.filter(line => {
        const draws = line.split(': ')[1].split(';');
        return draws.every(draw => {
            return draw.trim().split(', ').every(d => {
                const [n, color] = d.split(' ');
                return cubes[color] >= Number(n);
            });
        });
    }).map(line => Number(line.split(': ')[0].split(' ')[1]))
));

// Part 2
console.log(sum(lines.map(line => {
    const min = {
        red: 0,
        green: 0,
        blue: 0,
    };
    for (const draw of line.split(': ')[1].split(';')) {
        for (const d of draw.trim().split(', ')) {
            const [n, color] = d.split(' ');
            min[color] = Math.max(min[color], Number(n));
        }
    }
    return Object.values(min).reduce((acc, v) => acc * v, 1);
})));
