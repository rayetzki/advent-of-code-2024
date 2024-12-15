import { CHARS, REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const input = await getFileInput('input.txt');

const grid = input.split(REGEX.NEWLINE);

const [WIDTH, HEIGHT] = [grid[0].length, grid.length];

const getNeighbours = (x, y) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]; 

const getGridRegions = () => {
  const regions = [];
  const visited = new Set();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const queue = [[x, y]];
      const region = [];

      while (queue.length > 0) {
        const [curX, curY] = queue.shift();
    
        const key = [curX, curY].join(CHARS.COMMA);
        if (visited.has(key)) continue;
        visited.add(key);
    
        region.push([curX, curY]);

        const directNeighbours = getNeighbours(curX, curY);
        const regionNeighbours = directNeighbours
          .filter(([nX, nY]) => nX >= 0 && nX < WIDTH && nY >= 0 && nY < HEIGHT)
          .filter(([nX, nY]) => grid[y][x] === grid[nY][nX]);

        if (regionNeighbours.length > 0) {
          queue.push(...regionNeighbours);
        }
      }

      if (region.length > 0) {
        regions.push(region);
      }
    }
  }
  
  return regions;
}

const regions = getGridRegions();

console.log('-- PART 1 --');

const getRegionPerimeter = (region) => {
  if (region.length === 1) return 4;
  
  return region.reduce((acc, [x, y]) => {
    const neighbours = getNeighbours(x, y);
    const nonRegionNeighbours = neighbours.filter(
      ([nX, nY]) => grid?.[nY]?.[nX] !== grid[y][x],
    );
    return acc + nonRegionNeighbours.length;
  }, 0);
}

const part1 = regions.reduce((acc, region) => {
  const perimeter = getRegionPerimeter(region);
  return acc + (region.length * perimeter);
}, 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const getKey = (cell) => cell.join(CHARS.COMMA);

const getRegionSides = (region) => {
  const cells = new Set(region.map(getKey));
  
  return Array.from(cells).reduce((acc, cell) => {
    const [x, y] = cell.split(CHARS.COMMA).map(Number);

    const [N, NE] = [[x, y - 1], [x + 1, y - 1]];
    const [W, NW] = [[x - 1, y], [x - 1, y - 1]];
    const [E, SE] = [[x + 1, y], [x + 1, y + 1]];
    const [S, SW] = [[x, y + 1], [x - 1, y + 1]];

    const cornerSides = [
      [N, E, NE],
      [S, E, SE],
      [S, W, SW],
      [N, W, NW],
    ];

    const corners = cornerSides.reduce((acc, corner) => {
      const [vertical, horizontal, diagonal] = corner.map(getKey);

      if (
        (!cells.has(vertical) && !cells.has(horizontal)) ||
        (cells.has(vertical) && cells.has(horizontal) && !cells.has(diagonal))
      ) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return acc + corners;
  }, 0);
};

const part2 = regions.reduce((acc, region) => {
  const numberOfSides = getRegionSides(region);
  return acc + (region.length * numberOfSides);
}, 0);

console.log('Result:', part2);