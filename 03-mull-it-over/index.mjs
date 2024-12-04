import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const inputFilePath = join('./', import.meta.dirname, 'input.txt');
const fileInput = await readFile(inputFilePath, { encoding: 'utf-8' });

console.log('-- PART 1 --');

const regexOne = /mul\((?<first>\d+)\,(?<second>\d+)\)/g;

const part1 = [...fileInput.matchAll(regexOne)]
  .map(result => result.groups)
  .reduce((acc, { first, second }) => acc + (Number(first) * Number(second)), 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const regexTwo = /mul\((?<first>\d+)\,(?<second>\d+)\)|do\(\)|don't\(\)/g;

console.time();
const part2 = [...fileInput.matchAll(regexTwo)]
  .reduce((acc, match) => {
    if (match[0] === "do()") {
      acc.isAllowedToMultiply = true;
    } else if (match[0] === "don't()") {
      acc.isAllowedToMultiply = false;
    } else {
      const { first, second } = match.groups;
      if (acc.isAllowedToMultiply) {
        acc.multiplicationSum += (Number(first) * Number(second));
      }
    }
    return acc;
  }, { isAllowedToMultiply: true, multiplicationSum: 0 });

console.timeEnd();
console.log('Result:', part2.multiplicationSum);