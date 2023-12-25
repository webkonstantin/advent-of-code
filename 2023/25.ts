import * as assert from 'assert';
import { range, shuffle, sum } from 'lodash-es';

import { getInput } from './get-input';
import * as unionFind from './union-find';
import type { UnionFindNode } from './union-find';

function part1(input: string) {
    const allNodes = new Set<string>();
    let connections = input.split('\n').map(line => {
        const nodes = line.match(/(\w+)/g);
        nodes.forEach(node => allNodes.add(node));
        const [from, ...to] = nodes;
        return to.map(to_ => [from, to_]);
    }).flat();
    // console.log(connections);
    connections = shuffle(connections);

    for (const skip1 of range(connections.length)) {
        for (const skip2 of range(skip1 + 1, connections.length)) {
            console.log(skip2);
            next: for (const skip3 of range(skip2 + 1, connections.length)) {

                const nodesToSet = Object.fromEntries([...allNodes].map(name => [name, unionFind.makeSet({ name })]));
                const skipped = [skip1, skip2, skip3];
                const areSkippedConnected = skipped.some((i) => {
                    const [from, to] = connections[i];
                    return unionFind.find(nodesToSet[from]) === unionFind.find(nodesToSet[to]);
                });

                for (let i = 0; i < connections.length; i++) {
                    if (skipped.includes(i)) continue;
                    if (areSkippedConnected) continue next;
                    const [from, to] = connections[i];
                    unionFind.union(nodesToSet[from], nodesToSet[to]);
                }

                const groups = new Map<UnionFindNode, number>();
                for (const node of allNodes) {
                    const root = unionFind.find(nodesToSet[node]);
                    groups.set(root, (groups.get(root) ?? 0) + 1);
                }

                if (groups.size === 2) {
                    return [...groups.values()].reduce((a, b) => a * b);
                }

            }
        }
    }
}

function part2(input: string) {
}

const input = await getInput(25);

const sample = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`.trim();

assert.equal(part1(sample), 54);
// assert.equal(part2(sample), );

console.log(part1(input));
// console.log(part2(input));
