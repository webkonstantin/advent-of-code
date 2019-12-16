import axios from 'axios';
import fs from 'fs';
import slugify from 'slugify';

const api = axios.create({
  baseURL: 'https://adventofcode.com',
  headers: {
    Cookie: `session=${process.env.SESSION_ID};`
  },
  transformResponse: [], // don't try to parse json
})

slugify.extend({'/': '-'});

export default async function get(url: string) {
  const path = `inputs/${slugify(url)}.txt`;

  if (fs.existsSync(path)) {
    return fs.readFileSync(path).toString();
  }

  const response = await api.get<string>(url);
  fs.writeFileSync(path, response.data);

  return response.data;
};
