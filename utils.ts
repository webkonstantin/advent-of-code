import {zip} from 'lodash';

export const splitLines = (str: string): string[] => str.match(/[^\r\n]+/g);
export const splitNumbers = (str: string): number[] => str.split(',').map(Number);

export function sumPoints<T extends number[]>(p1: T, p2: T): T {
  return zip(p1, p2).map(([v1, v2]) => {
    return v1 + v2;
  }) as T;
}

export function negatePoint<T extends number[]>(p1: T): T {
  return p1.map(v => -v) as T;
}
