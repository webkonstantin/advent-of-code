import * as assert from 'assert';
import { getInput } from './get-input';
import { mapValues, range } from 'lodash-es';

function part1(input: string) {
    const modules = Object.fromEntries(input.split('\n').map(line => {
        // console.log(line);
        const [left, right] = line.split(' -> ');
        const name = left.match(/(\w+)$/)[1];
        const type = left.match(/^(\W)/)?.[1] || null as null | '&' | '%';
        const dsts = right.split(', ');
        return [name, { type, dsts }];
    }));
    const q = [] as {
        target: string;
        value: boolean;
        from?: string;
    }[];

    // Flip-flop modules (prefix %) are either on or off; they are initially off. If a flip-flop module receives a high pulse, it is ignored and nothing happens. However, if a flip-flop module receives a low pulse, it flips between on and off.
    // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
    const flipFlop = {}; // %

    // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; they initially default to remembering a low pulse for each input. When a pulse is received, the conjunction module first updates its memory for that input. Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.

    // &
    const conjunction = mapValues(modules, () => new Set<string>());

    const inputCounts = {}; // module name to number of inputs
    for (const [name, m] of Object.entries(modules)) {
        for (const dst of m.dsts) {
            inputCounts[dst] = (inputCounts[dst] || 0) + 1;
        }
    }

    const countSignals: Record<string, number> = {};
    const send = (target: string, value: boolean, from?: string) => {
        q.push({ target, value, from });
        const key = value.toString();
        countSignals[key] = (countSignals[key] || 0) + 1;
    };

    let processSignals = function () {
        while (q.length) {
            const signal = q.shift()!;
            const receiverName = signal.target;
            const receiver = modules[receiverName];
            if (!receiver) {
                // console.log('no receiver', receiverName);
                continue;
            }

            if (receiverName === 'broadcaster') {
                for (const dst of receiver.dsts) {
                    const from = receiverName;
                    send(dst, signal.value, from);
                }
            } else if (receiver.type === '%') {
                if (!signal.value) {
                    // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
                    const wasOn = flipFlop[receiverName];
                    const value = !wasOn;
                    flipFlop[receiverName] = !wasOn;
                    for (const target of receiver.dsts) {
                        const from = receiverName;
                        send(target, value, from);
                    }
                }
            } else if (receiver.type === '&') {
                // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; they initially default to remembering a low pulse for each input. When a pulse is received, the conjunction module first
                // updates its memory for that input. Then,
                // if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
                if (signal.value) {
                    conjunction[receiverName].add(signal.from);
                } else {
                    conjunction[receiverName].delete(signal.from);
                }
                const everyInputIsHigh = conjunction[receiverName].size === inputCounts[receiverName];
                const value = !everyInputIsHigh;
                for (const target of receiver.dsts) {
                    const from = receiverName;
                    send(target, value, from);
                }
            }
        }
    };
    for (const _ of range(1000)) {
        send('broadcaster', false, 'button');
        processSignals();
    }

    return Object.values(countSignals).reduce((a, b) => a * b);
}

// todo
function part2(input: string) {
    const modules = Object.fromEntries(input.split('\n').map(line => {
        // console.log(line);
        const [left, right] = line.split(' -> ');
        const name = left.match(/(\w+)$/)[1];
        const type = left.match(/^(\W)/)?.[1] || null as null | '&' | '%';
        const dsts = right.split(', ');
        return [name, { type, dsts }];
    }));
    const q = [] as {
        target: string;
        value: boolean;
        from?: string;
    }[];

    // Flip-flop modules (prefix %) are either on or off; they are initially off. If a flip-flop module receives a high pulse, it is ignored and nothing happens. However, if a flip-flop module receives a low pulse, it flips between on and off.
    // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
    const flipFlop = {}; // %

    // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; they initially default to remembering a low pulse for each input. When a pulse is received, the conjunction module first updates its memory for that input. Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.

    // &
    const conjunction = mapValues(modules, () => new Set<string>());

    const inputCounts = {}; // module name to number of inputs
    for (const [name, m] of Object.entries(modules)) {
        for (const dst of m.dsts) {
            inputCounts[dst] = (inputCounts[dst] || 0) + 1;
        }
    }

    const countSignals: Record<string, number> = {};
    const send = (target: string, value: boolean, from?: string) => {
        q.push({ target, value, from });
        const key = value.toString();
        countSignals[key] = (countSignals[key] || 0) + 1;
    };

    let hasRxLowSignal = false;
    let processSignals = function () {
        while (q.length) {
            const signal = q.shift()!;
            const receiverName = signal.target;
            const receiver = modules[receiverName];
            if (!receiver) {
                // console.log('no receiver', receiverName, signal.value);
                if (receiverName === 'rx' && signal.value === false) {
                    console.log('rx low signal');
                    hasRxLowSignal = true;
                }
                continue;
            }

            if (receiverName === 'broadcaster') {
                for (const dst of receiver.dsts) {
                    const from = receiverName;
                    send(dst, signal.value, from);
                }
            } else if (receiver.type === '%') {
                if (!signal.value) {
                    // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
                    const wasOn = flipFlop[receiverName];
                    const value = !wasOn;
                    flipFlop[receiverName] = !wasOn;
                    for (const target of receiver.dsts) {
                        const from = receiverName;
                        send(target, value, from);
                    }
                }
            } else if (receiver.type === '&') {
                // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; they initially default to remembering a low pulse for each input. When a pulse is received, the conjunction module first
                // updates its memory for that input. Then,
                // if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
                if (signal.value) {
                    conjunction[receiverName].add(signal.from);
                } else {
                    conjunction[receiverName].delete(signal.from);
                }
                const everyInputIsHigh = conjunction[receiverName].size === inputCounts[receiverName];
                const value = !everyInputIsHigh;
                for (const target of receiver.dsts) {
                    const from = receiverName;
                    send(target, value, from);
                }
            }
        }
    };
    let i = 0;
    while (++i) {
        if (i % 100000 === 0) {
            console.log(i);
        }
        send('broadcaster', false, 'button');
        processSignals();
        if (hasRxLowSignal) {
            return i;
        }
    }

    return Object.values(countSignals).reduce((a, b) => a * b);
}

const input = await getInput(20);

const sample1 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`.trim();

const sample2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`.trim();

assert.equal(part1(sample1), 32000000);
assert.equal(part1(sample2), 11687500);

console.log(part1(input));
console.log(part2(input));
