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

const ELEMENTS = {
  AIR: '.',
  WALL: '#',
  START: 'S',
  END: 'E'
};

const grid = input.split(REGEX.NEWLINE).map((line) => line.split(''));
const [WIDTH, HEIGHT] = [grid[0].length, grid.length];

const start = [];
const end = [];

for (let x = 0; x < WIDTH; x++) {
  for (let y = 0; y < HEIGHT; y++) {
    if (grid[y][x] === ELEMENTS.START) {
      start.push(x, y);
    } else if (grid[y][x] === ELEMENTS.END) {
      end.push(x, y);
    }
  }
}

const DIRECTIONS = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

const bfs = (start, end) => {
  const visited = new Set();
  const results = [];

  const queue = [{
    position: start,
    parent: null,
    picoseconds: 0,
  }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.picoseconds - b.picoseconds);

    const current = queue.shift();
    const key = current.position.join();

    if (visited.has(key)) continue;
    visited.add(key);

    if (current.position[0] === end[0] && current.position[1] === end[1]) {
      const path = [current.position.join()];
      
      let currentNode = current.parent;
      while (currentNode) {
        path.unshift(currentNode.position.join());
        currentNode = currentNode.parent;
      }

      return path;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const [newX, newY] = [current.position[0] + dx, current.position[1] + dy];
      
      if (
        newX < 0 ||
        newX >= WIDTH ||
        newY < 0 ||
        newY >= HEIGHT ||
        grid[newY][newX] === ELEMENTS.WALL ||
        visited.has([newX, newY].join())
      ) {
        continue;
      }

      queue.push({
        position: [newX, newY],
        picoseconds: current.picoseconds + 1,
        parent: current,
      });
    }
  }
  
  return results;
}

const path = bfs(start, end);

const calculatePotentialSavings = (path, maxPicoseconds) => {
  const picosecondsToSave = {};

  for (let i = 0; i < path.length - 1; i++) {
    for (let j = i + 1; j < path.length; j++) {
      const [[x1, y1], [x2, y2]] = [
        path[i].split(CHARS.COMMA).map(Number),
        path[j].split(CHARS.COMMA).map(Number),
      ];
  
      const currentPicoseconds = j - i;
      const potentialPicoseconds = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  
      if (potentialPicoseconds <= maxPicoseconds) {
        const savedPicoseconds = currentPicoseconds - potentialPicoseconds;
        if (savedPicoseconds <= 0) continue;
        picosecondsToSave[savedPicoseconds] ??= 0;
        picosecondsToSave[savedPicoseconds]++;
      }
    }
  }
  
  return picosecondsToSave;
}

console.log('-- PART 1 --');

const part1 = Object.entries(calculatePotentialSavings(path, 2))
  .reduce((acc, [saved, savedCount]) => {
    if (saved >= 100) return acc + savedCount;
    return acc;
  }, 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const part2 = Object.entries(calculatePotentialSavings(path, 20))
  .reduce((acc, [saved, savedCount]) => {
    if (saved >= (isTest ? 6 : 100)) return acc + savedCount;
    return acc;
  }, 0);

console.log('Result:', part2);

