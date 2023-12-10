import * as fs from 'fs';
import { fileURLToPath } from 'url';

export const getInput = async (day: number) => {
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const path = `${__dirname}/inputs/${day.toString().padStart(2, '0')}.txt`;
    if (fs.existsSync(path)) {
        return fs.readFileSync(path).toString().trim();
    }
    const url = `https://adventofcode.com/2023/day/${day}/input`;
    const cookie = `session=${process.env.AOC_SESSION_ID};`;
    const response = await fetch(url, { headers: { cookie } });
    const text = await response.text();
    if (!response.ok) {
        console.error(text);
        throw new Error(`Failed to fetch input for day ${day}`);
    }
    fs.writeFileSync(path, text);
    return text.trim();
};
