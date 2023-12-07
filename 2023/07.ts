import * as fs from 'fs';
import * as assert from 'assert';
import { sortBy } from 'lodash-es';

function part1(input: string) {
    const cards = 'AKQJT98765432';
    const lines = input.split('\n').map(line => {
        const [hand, bid] = line.split(' ');
        const counts = {};
        for (const card of hand) {
            counts[card] = (counts[card] || 0) + 1;
        }
        const type = Object.values(counts).sort().reverse().join('').padEnd(5, '0');
        return {
            type,
            hand: hand.split('').map(c => {
                return cards.length - cards.indexOf(c);
            }),
            oh: hand,
            bid: parseInt(bid),
        };
    });
    return sortBy(lines, ['type', 'hand.0', 'hand.1', 'hand.2', 'hand.3', 'hand.4'])
        .reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

function part2(input: string) {
    const cards = 'AKQT98765432J';
    const lines = input.split('\n').map(line => {
        const [hand, bid] = line.split(' ');
        const counts: Record<string, number> = {};
        let jokers = 0;
        for (const card of hand) {
            if (card === 'J') jokers++;
            else counts[card] = (counts[card] || 0) + 1;
        }
        let type = Object.values(counts).sort().reverse();
        if (type.length === 0) type = [0];
        type[0] += jokers;
        return {
            type: type.join('').padEnd(5, '0'),
            hand: hand.split('').map(c => {
                return cards.length - cards.indexOf(c);
            }),
            oh: hand,
            bid: parseInt(bid),
        };
    });
    return sortBy(lines, ['type', 'hand.0', 'hand.1', 'hand.2', 'hand.3', 'hand.4'])
        .reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

const sample = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`.trim();

assert.equal(part1(sample), 6440);
assert.equal(part2(sample), 5905);

const input = fs.readFileSync('input07.txt', 'utf8').trim();

console.log(part1(input));
console.log(part2(input));
