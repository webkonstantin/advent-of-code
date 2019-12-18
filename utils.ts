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

export function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

export function lcm(...params: number[]): number {
  function lcm2(a: number, b: number): number {
    if (b === 0) return 0;
    return a / gcd(a, b) * b;
  }

  return params.reduce((acc, i) => lcm2(acc, i), 1);
}

// https://gist.github.com/jonathanmarvens/7206278
export function primeFactorization(number: number, result: number[] = []): number[] {
  result = (result || []);
  const root = Math.sqrt(number);
  let x = 2;

  if (number % x) {
    x = 3;

    while ((number % x) && ((x = (x + 2)) < root)) {}
  }

  x = (x <= root) ? x : number;

  result.push(x);

  return (x === number) ? result : primeFactorization((number / x), result);
}

export const sleep = (d: number) => new Promise(resolve => setTimeout(() => resolve(), d));
