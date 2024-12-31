import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';
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

const ARROWS = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  'v': { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
};

const KEYPAD = {
  '7': { x: 0, y: 0 },
  '8': { x: 1, y: 0 },
  '9': { x: 2, y: 0 },
  '4': { x: 0, y: 1 },
  '5': { x: 1, y: 1 },
  '6': { x: 2, y: 1 },
  '1': { x: 0, y: 2 },
  '2': { x: 1, y: 2 },
  '3': { x: 2, y: 2 },
  'X': { x: 0, y: 3 },
  '0': { x: 1, y: 3 },
  'A': { x: 2, y: 3 },
};

const DIRECTIONS = {
  'X': { x: 0, y: 0 },
  '^': { x: 1, y: 0 },
  'A': { x: 2, y: 0 },
  '<': { x: 0, y: 1 },
  'v': { x: 1, y: 1 },
  '>': { x: 2, y: 1 },
};

const cache = new Map();

const paths = (input, start, end) => {
  const queue = [{ ...input[start], path: '' }];
  const distances = {};

  if (start === end) return ["A"];

  const allPaths = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const key = [current.x, current.y].join();

    if (current.x === input[end].x && current.y === input[end].y) {
      allPaths.push(current.path + 'A');
    }
    
    if (Object.hasOwn(distances, key) && distances[key] < current.path.length) {
      continue;
    }

    for (const [direction, vector] of Object.entries(ARROWS)) {
      const position = { x: current.x + vector.x, y: current.y + vector.y };
      if (input.X.x === position.x && input.X.y === position.y) continue;

      const button = Object.values(input).find(
        (pad) => pad.x === position.x && pad.y === position.y,
      );

      if (!button) continue;

      const newKey = [position.x, position.y].join();
      const newPath = current.path + direction;

      if (!Object.hasOwn(distances, newKey) || distances[newKey] >= newPath.length) {
        queue.push({ ...position, path: newPath });
        distances[newKey] = newPath.length;
      }
    };
  }

  return allPaths.sort((a, b) => a.length - b.length);
};

const presses = (input, code, robotsCount) => {
  const key = [code, robotsCount].join();

  if (cache.has(key)) return cache.get(key);

  let fromChar = 'A', length = 0;
  
  for (const toChar of code) {
    const moves = paths(input, fromChar, toChar);
    
    if (robotsCount === 0) {
      length += moves[0].length;
    } else {
      length += Math.min(
        ...moves.map((move) => presses(DIRECTIONS, move, robotsCount - 1)),
      );
    }

    fromChar = toChar;
  }

  cache.set(key, length);
  return length;
};

console.log('-- PART 1 --');

const part1 = input.split(REGEX.NEWLINE).reduce((acc, code) => {
  const [_, numerical, ...__] = code.match(/([0-9]+)[A-Z]/);
  return acc + parseInt(numerical) * presses(KEYPAD, code, 2);
}, 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const part2 = input.split(REGEX.NEWLINE).reduce((acc, code) => {
  const [_, numerical, ...__] = code.match(/([0-9]+)[A-Z]/);
  return acc + parseInt(numerical) * presses(KEYPAD, code, 25);
}, 0);

console.log('Result:', part2);