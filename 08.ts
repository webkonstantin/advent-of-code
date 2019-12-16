import get from './api';

const w = 25;
const h = 6;

function chunk<T>(elements: T[], size: number): T[][] {
    const chunks: T[][] = [];
    elements.forEach((char, index) => {
        const layer = Math.floor(index / size);
        chunks[layer] = chunks[layer] || [];
        chunks[layer].push(char);
    });
    return chunks;
}

function runA(layers: string[][]) {
    function countChars(countChar: string) {
        return (layer: string[]) => {
            let c = 0;
            for (const char of layer) {
                if (char === countChar) {
                    c++;
                }
            }
            return c;
        };
    }

    const zeros = layers.map(countChars('0'));

    const indexOfMinValue = zeros.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);

    console.log(countChars('1')(layers[indexOfMinValue]) * countChars('2')(layers[indexOfMinValue]));
}

function runB(layers: string[][]) {
    const final = layers[0];
    layers.slice(1).forEach(layer => layer.forEach((char, position) => {
        if (final[position] === '2') {
            final[position] = char;
        }
    }));
    console.log(
        chunk(final, w).map(s => s.map(c => c === '1' ? '◼' : ' ').join('')).join('\n')
    );
}

const run = async () => {
    const data = await get('2019/day/8/input');

    const chars: string[] = data.trim().split('');

    const layers = chunk(chars, w * h);

    runA(layers);
    runB(layers);
};

if (require.main === module) {
    run();
}
