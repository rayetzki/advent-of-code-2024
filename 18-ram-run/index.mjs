import { getFileInput } from '../utils.mjs';
import { CHARS, REGEX } from '../common.mjs';
import { parseArgs } from 'node:util';

const { values: { isTest } } = parseArgs({
  options: {
    isTest: {
      type: 'boolean',
      default: false
    },
  },
});

const input = await getFileInput(`${isTest ? 'test' : 'input'}.txt`);

const bytes = input
  .split(REGEX.NEWLINE)
  .map((pair) => pair.split(CHARS.COMMA).map(Number));

const SIZE = isTest ? 7 : 71;

const ELEMENTS = {
  AIR: '.',
  STEP: 'O',
  BYTE: '#'
};

const start = [0, 0];
const end = [SIZE - 1, SIZE - 1];

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const aStarShortestPath = (grid, start, end) => {
  const visited = new Set();
  
  const queue = [{
    position: start,
    steps: 0,
    parent: null,
  }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.steps - b.steps);

    const current = queue.shift();
    const key = current.position.join();
    
    if (visited.has(key)) continue;
    visited.add(key);

    if (current.position[0] === end[0] && current.position[1] === end[1]) {
      return current.steps;
    }

    for (const [dX, dY] of DIRECTIONS) {
      const [nextX, nextY] = [current.position[0] + dX, current.position[1] + dY];
      if (!grid?.[nextY]?.[nextX] || grid[nextY][nextX] === ELEMENTS.BYTE) continue;

      queue.push({
        position: [nextX, nextY],
        steps: current.steps + 1,
        parent: current,
      });
    }
  }
 
  return -1;
}

console.log('-- PART 1 --');

const BYTES_TO_FALL = isTest ? 12 : 1024;

const initialGrid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(ELEMENTS.AIR));

const grid = [...initialGrid];

let currentByteIndex = 0;

while (currentByteIndex !== BYTES_TO_FALL) {
  const [bX, bY] = bytes[currentByteIndex];
  grid[bY][bX] = ELEMENTS.BYTE;
  currentByteIndex++;
}

const part1 = aStarShortestPath(grid, start, end);

console.log('Result:', part1);

console.log('-- PART 2 --');

currentByteIndex = 0;
const newGrid = [...initialGrid];
let isPathNotFound = false;

do {
  const [bX, bY] = bytes[currentByteIndex];
  newGrid[bY][bX] = ELEMENTS.BYTE;
  isPathNotFound = aStarShortestPath(newGrid, start, end) === -1;
  if (isPathNotFound) {
    console.log('Result:', [bX, bY]);
  }
  currentByteIndex++;
} while (isPathNotFound === false && currentByteIndex < bytes.length);
