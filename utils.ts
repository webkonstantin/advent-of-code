import {Point} from './types';

export const splitLines = (str: string): string[] => str.match(/[^\r\n]+/g);
export const splitNumbers = (str: string): number[] => str.split(',').map(Number);

export const addPoints = (p1: Point, p2: Point): Point => {
  return [
    p1[0] + p2[0],
    p1[1] + p2[1],
  ];
}
