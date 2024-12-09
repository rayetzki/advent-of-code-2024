import { CHARS, REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const fileInput = await getFileInput('input.txt');

const initialGrid = fileInput.split(REGEX.NEWLINE).map(line => line.split(''));

const [WIDTH, HEIGHT] = [initialGrid[0].length, initialGrid.length];

const ELEMENTS = {
  OBSTACLE: '#',
  AIR: '.',
  STEP: 'X',
};

const DIRECTIONS = {
  NORTH: '^',
  SOUTH: 'v',
  EAST: '>',
  WEST: '<',
};

const ALL_DIRECTIONS = Object.values(DIRECTIONS);

const DIRECTION_DELTAS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// Get initial guard position

const initialState = {
  position: '',
  direction: '',
  visited: new Set(),
  steps: 0,
};

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (ALL_DIRECTIONS.includes(initialGrid[y][x])) {
      initialState.position = [x, y].join(CHARS.COMMA);
      initialState.direction = initialGrid[y][x];
      initialGrid[y][x] = ELEMENTS.AIR;
    }
  }
}

const state = { ...initialState };

const getNextGuardPosition = (grid) => {
  const [guardX, guardY] = state.position.split(CHARS.COMMA).map(Number);

  const [
    [upX, upY],
    [rightX, rightY],
    [downX, downY],
    [leftX, leftY],
  ] = [
    [guardX, guardY - 1],
    [guardX + 1, guardY],
    [guardX, guardY + 1],
    [guardX - 1, guardY],
  ];
  
  let nextPosition = state.position.split(CHARS.COMMA).map(Number);
  let nextDirection = state.direction;

  const [up, right, down, left] = [
    grid?.[upY]?.[upX],
    grid?.[rightY]?.[rightX],
    grid?.[downY]?.[downX],
    grid?.[leftY]?.[leftX],
  ];
  
  // If an obstacle encountered, turn 90 degrees around the clock
  if (state.direction === DIRECTIONS.NORTH && up === ELEMENTS.OBSTACLE) {
    nextPosition = [rightX, rightY];
    nextDirection = DIRECTIONS.EAST;
  } else if (state.direction === DIRECTIONS.EAST && right === ELEMENTS.OBSTACLE) {
    nextPosition = [downX, downY];
    nextDirection = DIRECTIONS.SOUTH;
  } else if (state.direction === DIRECTIONS.SOUTH && down === ELEMENTS.OBSTACLE) {
    nextPosition = [leftX, leftY];
    nextDirection = DIRECTIONS.WEST;
  } else if (state.direction === DIRECTIONS.WEST && left === ELEMENTS.OBSTACLE) {
    nextPosition = [upX, upY];
    nextDirection = DIRECTIONS.NORTH;
  }

  // If no obstacles are on the way, get next position
  if (nextDirection === state.direction) {
    if (state.direction === DIRECTIONS.NORTH) {
      nextPosition = [upX, upY];
    } else if (state.direction === DIRECTIONS.EAST) {
      nextPosition = [rightX, rightY];
    } else if (state.direction === DIRECTIONS.SOUTH) {
      nextPosition = [downX, downY];
    } else if (state.direction === DIRECTIONS.WEST) {
      nextPosition = [leftX, leftY];
    }
  }

  return { nextPosition, nextDirection };
}

const checkGridBorders = ([x, y]) => {
  return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
};

console.log('-- PART 1 --');

const grid = [...initialGrid];

do {
  const { nextDirection, nextPosition } = getNextGuardPosition(grid);
  state.visited.add(state.position);
  state.steps++;
  state.position = nextPosition.join(CHARS.COMMA);
  state.direction = nextDirection;
} while (checkGridBorders(state.position.split(CHARS.COMMA)));

console.log('Result:', state.visited.size);

console.log('-- PART 2 --');

const checkLoop = (grid) => {
  const visited = new Set();

  const [startX, startY] = initialState.position.split(CHARS.COMMA).map(Number);
  const startDirection = ALL_DIRECTIONS.findIndex(dir => dir === initialState.direction);

  let [x, y] = [startX, startY];
  let direction = startDirection;

  while (true) {
    const key = [x, y, direction].join(CHARS.COMMA);
  
    if (visited.has(key)) return true;
    visited.add(key);

    const [newDirX, newDirY] = DIRECTION_DELTAS[direction];
    const [nextX, nextY] = [x + newDirX, y + newDirY];

    if (!checkGridBorders([nextX, nextY])) {
      return false;
    }

    if (grid[nextY][nextX] === ELEMENTS.OBSTACLE) {
      direction = (direction + 1) % ALL_DIRECTIONS.length;
    } else {
      [x, y] = [nextX, nextY];
    }
  }
}

const totalLoopPaths = Array.from(state.visited)
  .reduce((acc, visited) => {
    const [x, y] = visited.split(CHARS.COMMA).map(Number);

    grid[y][x] = ELEMENTS.OBSTACLE;
    const isLoopPath = checkLoop(grid);    
    grid[y][x] = ELEMENTS.AIR;
    
    return isLoopPath ? acc + 1 : acc;
  }, 0);

console.log('Result:', totalLoopPaths - 1);