import get from '../api';

const day = '0';

function prepareInput(input: string) {
    return input;
}


function runA(input: Input) {
    //
}

function runB(input: Input) {
    //
}

// assert.equal(0, runA(prepareInput(``)));
// assert.equal(0, runB(prepareInput(``)));

type Input = ReturnType<typeof prepareInput>;

const run = async () => {
    const input = await get(`2021/day/${day}/input`);
    console.log(runA(prepareInput(input)));
    console.log(runB(prepareInput(input)));
};

if (require.main === module) {
    run().catch(console.error);
}
