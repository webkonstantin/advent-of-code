import { getInput } from './get-input';
import * as assert from 'node:assert';

const input = await getInput(9);

const part1 = (input: string) => {
  const a = input.split('').map(Number);

  function* go() {
    let r = a.length - 1;
    if (r % 2 === 1) r--;
    while (a[r] === 0) r -= 2;
    const fromRight = () => {
      const val = r / 2;
      a[r] -= 1;
      while (a[r] === 0) r -= 2;
      return val;
    };
    for (let l = 0; l < a.length; l++) {
      for (let i = 0; i < a[l] && l <= r; i++) {
        yield l % 2 === 0 ? l / 2 : fromRight();
      }
    }
  }

  let sum = 0;
  let i = 0;
  for (const id of go()) {
    sum += id * i;
    i++;
  }

  return sum;
};

assert.equal(part1('2333133121414131402'), 1928);

console.log(part1(input));

function* repeat<T>(n: number, value: T): Generator<T> {
  for (let i = 0; i < n; i++) {
    yield value;
  }
}

const part2 = (input: string) => {
  const a = input.split('').map(Number);

  type SpaceIndex = number;
  const moved = new Map<SpaceIndex, {
    id: number;
    size: number;
  }[]>();
  const movedFilesIdx = new Set<number>();

  function* go() {
    for (let i = 0; i < a.length; i++) {
      if (i % 2 === 0) {
        const size = a[i];
        if (movedFilesIdx.has(i)) {
          yield* repeat(size, '.' as const);
        } else {
          yield* repeat(size, i / 2);
        }
      } else {
        for (const { id, size } of moved.get(i) ?? []) {
          yield* repeat(size, id);
        }
        yield* repeat(a[i], '.' as const);
      }
    }
  }

  let r = a.length - 1;
  if (r % 2 === 1) r--;
  while (a[r] === 0) r -= 2;
  for (; r > 0; r -= 2) {
    const size = a[r];
    const id = r / 2;
    for (let i = 1; i < r; i += 2) {
      const spaceAvailable = a[i];
      if (spaceAvailable >= size) {
        a[i] -= size;

        const movedHere = moved.get(i) ?? [];
        movedHere.push({ id, size });
        moved.set(i, movedHere);

        movedFilesIdx.add(r);
        break;
      }
    }
  }

  let sum = 0;
  let i = 0;
  for (const id of go()) {
    if (id !== '.') {
      sum += id * i;
    }
    i++;
  }

  return sum;
};

assert.equal(part2('2333133121414131402'), 2858);

console.log(part2(input));
