const { lcm } = require('./dist/utils');

test('lcm', () => {
  expect(lcm(2,5)).toBe(10);
  expect(lcm(2,3,5,6)).toBe(30);
});
