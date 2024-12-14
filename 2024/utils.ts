export function ints(s: string) {
  return s.match(/-?\d+/g).map(Number);
}
