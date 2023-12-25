// `inspired` by https://github.com/manubb/union-find/blob/ca55a728b7564c097bfd8a123eeeed840c08d14c/src/union-find.js

export type UnionFindNode = {
    parent: UnionFindNode;
    rank: number;
    [key: string]: any;
};

export const makeSet = (props?: object) => {
    const node = { rank: 0, ...props } as UnionFindNode;
    node.parent = node;
    return node;
};

export const find = (node: UnionFindNode) => {
    if (node.parent !== node) {
        node.parent = find(node.parent);
    }
    return node.parent;
};

export const union = (node1: UnionFindNode, node2: UnionFindNode) => {
    const root1 = find(node1);
    const root2 = find(node2);
    if (root1 !== root2) {
        if (root1.rank < root2.rank) {
            root1.parent = root2;
        } else {
            root2.parent = root1;
            if (root1.rank === root2.rank) root1.rank += 1;
        }
    }
};
