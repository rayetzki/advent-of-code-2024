import { getFileInput } from '../utils.mjs';
import { CHARS, REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');
const grid = input.split(REGEX.NEWLINE);

const [WIDTH, HEIGHT] = [grid[0].length, grid.length];

const getNeighbours = (x, y) => {
  return [
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
  ];
}

console.log('-- PART 1 --');

const getCoordKey = (x, y) => [x, y].join(CHARS.COMMA);

let totalSummitsScore = 0;

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (Number(grid[y][x]) !== 0) continue; 
    const queue = [[x, y]];
    const visited = new Set([getCoordKey(x, y)]);

    while (queue.length > 0) {
      const [nextX, nextY] = queue.shift();
      
      for (const [nX, nY] of getNeighbours(nextX, nextY)) {
        if (nX < 0 || nX >= WIDTH || nY < 0 || nY >= HEIGHT) continue;
        if (parseInt(grid[nY][nX]) !== parseInt(grid[nextY][nextX]) + 1) continue;
        const coordKey = getCoordKey(nX, nY);
        if (visited.has(coordKey)) continue;
        visited.add(coordKey);
        
        if (parseInt(grid[nY][nX]) === 9) {
          totalSummitsScore++;
        } else {
          queue.push([nX, nY]);
        }
      }
    }
  }
}

console.log('Result:', totalSummitsScore);

console.log('-- PART 2 --');

let totalUniqueTrailheads = 0;

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (parseInt(grid[y][x]) !== 0) continue;
    
    const queue = [[x, y, 0]];
    
    while (queue.length > 0) {
      const [x, y] = queue.shift();
      
      if (parseInt(grid[y][x]) === 9) {
        totalUniqueTrailheads++;
        continue;
      }

      for (const [nX, nY] of getNeighbours(x, y)) {
        if (nX < 0 || nX >= WIDTH || nY < 0 || nY >= HEIGHT) continue;
        if (parseInt(grid[nY][nX]) !== parseInt(grid[y][x]) + 1) continue;
        queue.push([nX, nY]);
      }
    }
  }
}

console.log('Result:', totalUniqueTrailheads);