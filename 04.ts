import assert from 'assert';

const ok = (n: number): boolean => {
  const chars = String(n).split('');

  // const six = chars.length === 6;
  const same = [...Array(5).keys()].some(index => chars[index] === chars[index + 1]);
  const increases = [...Array(5).keys()].every(index => chars[index] <= chars[index + 1]);

  return same && increases;
};

const ok2 = (n: number): boolean => {
  const chars = String(n).split('');

  // const six = chars.length === 6;
  const same = [...Array(5).keys()].some(index => {
    return (
      chars[index] === chars[index + 1] &&
      chars[index] !== chars[index - 1] &&
      chars[index + 1] !== chars[index + 2]
    );
  });
  const increases = [...Array(5).keys()].every(index => chars[index] <= chars[index + 1]);

  return same && increases;
};

assert.equal(ok(111111), true);
assert.equal(ok(223450), false);
assert.equal(ok(123789), false);

const run = () => {
  let c = 0;
  let c2 = 0;
  for (let i = 193651; i <= 649729; i++) {
    if (ok(i)) c++;
    if (ok2(i)) c2++;
  }

  console.log(c)
  console.log(c2)
};

run();
