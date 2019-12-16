export const splitLines = (str: string): string[] => str.match(/[^\r\n]+/g);
export const splitNumbers = (str: string) => str.split(',').map(Number);
