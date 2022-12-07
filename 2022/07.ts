import assert from 'assert';
import get from '../api';
import { splitLines } from '../utils';
import { sum } from 'lodash';

const day = '7';

function prepareInput(input: string) {
  return splitLines(input);
}

function getDirSizes(input: string[]) {
  const dirSizes: Record<string, number> = {};
  let path: string[] = [''];
  for (const line of input) {
    if (line.startsWith(`$ cd`)) {
      const arg = line.slice(5);
      if (arg === '/') {
        path = [''];
      } else if (arg === '..') {
        path.pop();
      } else {
        path.push(arg);
      }
    } else if (!line.startsWith(`$ ls`)) {
      const [size] = line.split(' ');
      if (size !== 'dir') {
        for (let i = 1; i <= path.length; i++) {
          const p = path.slice(0, i).join('/');
          dirSizes[p] = dirSizes[p] || 0;
          dirSizes[p] += Number(size);
        }
      }
    }
  }
  return dirSizes;
}

function runA(input: Input) {
  const dirSizes = getDirSizes(input);
  return sum(Object.values(dirSizes).filter(sz => sz < 100000));
}

function runB(input: Input) {
  const dirSizes = getDirSizes(input);
  const free = 70000000 - dirSizes[''];
  const need = 30000000 - free;
  return Math.min(...Object.values(dirSizes).filter(sz => sz >= need));
}

const example = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;
assert.strictEqual(95437, runA(prepareInput(example)));
assert.strictEqual(24933642, runB(prepareInput(example)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
  const input = await get(`2022/day/${day}/input`);
  console.log(runA(prepareInput(input)));
  console.log(runB(prepareInput(input)));
};

if (require.main === module) {
  run().catch(console.error);
}
