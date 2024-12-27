import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const [towelsInput, designs] = input.split(REGEX.DOUBLE_NEWLINE);

const towels = towelsInput.split(REGEX.SEPARATOR);

console.log('-- PART 1 --');

const cache = new Map();

const possibleDesignCount = (design) => {
  if (cache.has(design)) return cache.get(design);
  if (design.length === 0) return 1;

  const count = towels.reduce((acc, towel) => {
    if (design.startsWith(towel)) {
      return acc + possibleDesignCount(design.slice(towel.length));
    }
    return acc;
  }, 0);

  cache.set(design, count);
  return count;
}

const part1 = designs
  .split(REGEX.NEWLINE)
  .reduce((acc, design) => acc + Number(possibleDesignCount(design) > 0), 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const part2 = designs
  .split(REGEX.NEWLINE)
  .reduce((acc, design) => acc + possibleDesignCount(design), 0);

console.log('Result:', part2);