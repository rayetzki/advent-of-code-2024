import { getFileInput } from '../utils.mjs';
import { REGEX, CHARS } from '../common.mjs';

const input = await getFileInput('test.txt');

const [warehouseMap, moves] = input.split(REGEX.DOUBLE_NEWLINE);

const initialGrid = warehouseMap.split(REGEX.NEWLINE).map(line => line.split(''));
const directions = moves.split(REGEX.NEWLINE).flatMap(line => line.split('')).join('');

const [WIDTH, HEIGHT] = [initialGrid[0].length, initialGrid.length];

const ELEMENTS = {
  BORDER: '#',
  AIR: '.',
  ROBOT: '@',
  BOX: 'O',
};

const MOVES = {
  LEFT: '<',
  UP: '^',
  RIGHT: '>',
  DOWN: 'v',
};

const MOVE_DELTAS = {
  [MOVES.DOWN]: [0, 1],
  [MOVES.UP]: [0, -1],
  [MOVES.LEFT]: [-1, 0],
  [MOVES.RIGHT]: [1, 0],
}

const drawGrid = (gr) => console.log(gr.map(line => line.join('')).join(CHARS.NEWLINE));

console.log('-- PART 1 --');

const grid = structuredClone(initialGrid);

const initialPosition = Array(2).fill(null);

for (let x = 1; x < WIDTH - 1; x++) {
  for (let y = 1; y < HEIGHT - 1; y++) {
    if (grid[y][x] === ELEMENTS.ROBOT) {
      initialPosition[0] = x;
      initialPosition[1] = y;
      break;
    }
  }
}

const findAirSpot = ([x, y], [dX, dY]) => {
  const [nextX, nextY] = [x + dX, y + dY];

  if (nextX <= 0 || nextX >= WIDTH - 1 || nextY <= 0 || nextY >= HEIGHT - 1) {
    return null;
  }

  const nextElement = grid[nextY][nextX];

  if (nextElement === ELEMENTS.BORDER) {
    return null;
  } else if (nextElement === ELEMENTS.AIR) {
    return [nextX, nextY];
  } else {
    const nextAirSpot = findAirSpot([nextX, nextY], [dX, dY]);
    if (!nextAirSpot) return null;
    const [airX, airY] = nextAirSpot;
    if (airX === nextX && airY === nextY) return [x, y];
    return [airX, airY];
  }
}

const moveRobot = ([x, y], [dX, dY], [airX, airY]) => {
  const [nextX, nextY] = [x + dX, y + dY];
  
  if (nextX === airX && nextY === airY) {
    grid[y][x] = ELEMENTS.AIR;
    grid[airY][airX] = ELEMENTS.ROBOT;
  } else {
    grid[nextY][nextX] = grid[y][x];
    grid[y][x] = grid[airY][airX];
    grid[airY][airX] = ELEMENTS.BOX;

    let [swapX, swapY] = [nextX + dX, nextY + dY];    
    do {
      grid[swapY][swapX] = ELEMENTS.BOX;
      [swapX, swapY] = [swapX + dX, swapY + dY];
    } while (swapX !== airX && swapY !== airY);
  }
}

let [curX, curY] = [...initialPosition];

for (const direction of directions) {
  const [dX, dY] = MOVE_DELTAS[direction];
  const nextAirPosition = findAirSpot([curX, curY], [dX, dY]);
  if (!nextAirPosition) continue;

  const [airX, airY] = nextAirPosition;
  moveRobot([curX, curY], [dX, dY], [airX, airY]);
  curX += dX; curY += dY;
}

let part1 = 0;

for (let x = 1; x < WIDTH - 1; x++) {
  for (let y = 1; y < HEIGHT - 1; y++) {
    if (grid[y][x] === ELEMENTS.BOX) {
      part1 += (100 * y + x);
    }
  }
}

console.log('Result:', part1);

console.log('-- PART 2 --');

const scaleGrid = (grid) => grid.map((row) => {
  return row.flatMap((col) => {
    if (col === ELEMENTS.BORDER) {
      return SCALE_ELEMENTS.BORDER.split('');
    } else if (col === ELEMENTS.BOX) {
      return SCALE_ELEMENTS.BOX.split('');
    } else if (col === ELEMENTS.AIR) {
      return SCALE_ELEMENTS.AIR.split('');
    } else if (col === ELEMENTS.ROBOT) {
      return SCALE_ELEMENTS.ROBOT.split('');
    }
  });
});

const gridWithScale = scaleGrid(structuredClone(initialGrid));

const initialPositionScaled = Array(2).fill(null);

for (let x = 1; x < WIDTH - 1; x++) {
  for (let y = 1; y < HEIGHT - 1; y++) {
    if (gridWithScale[y][x] === ELEMENTS.ROBOT) {
      initialPositionScaled[0] = x;
      initialPositionScaled[1] = y;
      break;
    }
  }
}

drawGrid(gridWithScale);