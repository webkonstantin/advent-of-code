import get from './api';

function runA() {
  //
}

function runB() {
  //
}

const run = async () => {
  const data = await get('2019/day/_/input');

  console.log(runA());
  console.log(runB());
};

if (require.main === module) {
  run();
}
