import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REGEX, CHARS } from '../common.mjs';

const inputFilePath = join('./', import.meta.dirname, 'input.txt');
const fileInput = await readFile(inputFilePath, { encoding: 'utf-8' });

const leftList = [];
const rightList = [];

for await (const line of fileInput.split(REGEX.NEWLINE)) {
  const [left, right] = line.split(CHARS.SPACE.repeat(3));
  leftList.push(parseInt(left));
  rightList.push(parseInt(right));
}

leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

console.log("-- PART 1 --");

let total = 0;

for (let i = 0; i < leftList.length; i++) {
  total += Math.abs(leftList[i] - rightList[i]);
}

console.log("Result: ", total);

console.log("-- PART 2 --");

const similarityScores = new Map();
let totalSimilarityScore = 0;

for (const left of leftList) {
  if (similarityScores.has(left)) {
    totalSimilarityScore += left * similarityScores.get(left);
    continue;
  }
  
  let appearTimes = 0;

  for (const right of rightList) {
    if (left === right) {
      appearTimes++;
    }
  }

  totalSimilarityScore += left * appearTimes;
  similarityScores.set(left, appearTimes);
}

console.log("Result: ", totalSimilarityScore);