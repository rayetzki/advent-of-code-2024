import { getFileInput } from '../utils.mjs';
import { CHARS, REGEX } from '../common.mjs';

const input = await getFileInput('test.txt');

const schemas = input
  .split(REGEX.DOUBLE_NEWLINE)
  .map(schema => schema.split(REGEX.NEWLINE).map(line => line.split('')));

const [WIDTH, HEIGHT] = [schemas[0][0].length, schemas[0].length];

const locks = new Set();
const keys = new Set();

for (const schema of schemas) {
  const heights = [];

  for (let x = 0; x < WIDTH; x++) {
    const cols = schema.map((row) => row[x]);
    heights.push(cols.filter((char) => char === CHARS.HASH).length - 1);
  }

  if (schema.at(0).every(char => char === CHARS.HASH)) {
    locks.add(heights.join());
  } else if (schema.at(-1).every(char => char === CHARS.HASH)) {
    keys.add(heights.join());
  }
}

const processed = new Set();
const fit = new Set();

for (const key of keys) {
  for (const lock of locks) {
    const pairKey = [key, lock].join(CHARS.COLON);
    if (processed.has(pairKey)) continue;
    
    const keyHeights = key.split(CHARS.COMMA).map(Number);
    const lockHeights = lock.split(CHARS.COMMA).map(Number);
    
    if (keyHeights.every((key, i) => (key + lockHeights[i]) < HEIGHT - 1)) {
      fit.add(pairKey);
    }
  
    processed.add(pairKey);
  }
}

console.log('Result:', fit.size);