import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';

export const getInput = async (day: number) => {
    if (!day) throw new Error('Missing day');

    // console.log(__dirname, Bun.fileURLToPath(new URL('.', import.meta.url)));
    const __dirname = fileURLToPath(new URL('.', import.meta.url));

    fs.mkdirSync(join(__dirname, 'inputs'), { recursive: true });

    const paddedDay = day.toString().padStart(2, '0');
    const path = join(__dirname, 'inputs', `${paddedDay}.txt`);

    if (fs.existsSync(path)) {
        return fs.readFileSync(path).toString().trim();
    }
    const url = `https://adventofcode.com/2024/day/${day}/input`;
    const cookie = `session=${process.env.AOC_SESSION_ID};`;
    const userAgent = 'https://github.com/webkonstantin/advent-of-code';
    const response = await fetch(url, { headers: { cookie, 'user-agent': userAgent } });
    const text = await response.text();
    if (!response.ok) {
        console.error(text);
        throw new Error(`Failed to fetch input for day ${day}`);
    }
    fs.writeFileSync(path, text);
    return text.trim();
};
