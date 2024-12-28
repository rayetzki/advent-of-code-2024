import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const maze = input.split(REGEX.NEWLINE).map(line => line.split(''));

const ELEMENTS = {
  AIR: '.',
  WALL: '#',
  START: 'S',
  END: 'E',
  N: '^',
  S: 'v',
  E: '>',
  W: '<'
};

const TURNS = {
  LEFT: {
    N: 'W',
    W: 'S',
    S: 'E',
    E: 'N'
  },
  RIGHT: {
    N: 'E',
    E: 'S',
    S: 'W',
    W: 'N'
  },
};

const DIRECTIONS = {
  N: [0, -1],
  W: [-1, 0],
  S: [0, 1],
  E: [1, 0],
};

const COST = {
  MOVE: 1,
  TURN: 1000
};

const start = Array(2).fill(0);
const end = Array(2).fill(0);

for (let x = 0; x < maze[0].length; x++) {
  for (let y = 0; y < maze.length; y++) {
    if (maze[y][x] === ELEMENTS.START) {
      start[0] = x;
      start[1] = y;
    } else if (maze[y][x] === ELEMENTS.END) {
      end[0] = x;
      end[1] = y;
    }
  }
}

const drawMaze = (maze) => console.log(maze.map(line => line.join('')).join('\n'));

console.log('-- PART 1 --');

const dijkstraBestPathByCost = (start, end) => {
  const grid = [...maze];

  const visited = new Map();
  
  const queue = [{
    position: [...start],
    cost: 0,
    direction: 'E',
    parent: null,
  }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    
    const currentNode = queue.shift();

    if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
      let pathNode = currentNode.parent;
      while (pathNode.parent) {
        const { position, direction } = pathNode;
        const [x, y] = position;
        grid[y][x] = ELEMENTS[direction];
        pathNode = pathNode.parent;
      }
      
      drawMaze(grid);
      return currentNode.cost;
    }

    const key = [...currentNode.position, currentNode.direction].join();

    if (visited.has(key) && (visited.get(key) <= currentNode.cost)) {
      continue;
    }

    visited.set(key, currentNode.cost);

    const [dx, dy] = DIRECTIONS[currentNode.direction];
    const [forwardX, forwardY] = [currentNode.position[0] + dx, currentNode.position[1] + dy];
    const forwardKey = [forwardX, forwardY, currentNode.direction].join();

    if (!visited.has(forwardKey) && grid?.[forwardY]?.[forwardX] !== ELEMENTS.WALL) {
      queue.push({
        position: [forwardX, forwardY],
        cost: currentNode.cost + COST.MOVE,
        direction: currentNode.direction,
        parent: currentNode,
      });
    }

    const turnLeftDirection = TURNS.LEFT[currentNode.direction];
    const [turnLeftdX, turnLeftdY] = DIRECTIONS[turnLeftDirection];
    const [turnLeftX, turnLeftY] = [currentNode.position[0] + turnLeftdX, currentNode.position[1] + turnLeftdY];
    const turnLeftKey = [turnLeftX, turnLeftY, turnLeftDirection].join();

    if (!visited.has(turnLeftKey) && maze?.[turnLeftY]?.[turnLeftX] !== ELEMENTS.WALL) {
      queue.push({
        position: [turnLeftX, turnLeftY],
        cost: currentNode.cost + COST.TURN + COST.MOVE,
        direction: turnLeftDirection,
        parent: currentNode,
      });
    }

    const turnRightDirection = TURNS.RIGHT[currentNode.direction];
    const [turnRightdX, turnRightdY] = DIRECTIONS[turnRightDirection];
    const [turnRightX, turnRightY] = [currentNode.position[0] + turnRightdX, currentNode.position[1] + turnRightdY];
    const turnRightKey = [turnRightX, turnRightY, turnRightDirection].join();

    if (!visited.has(turnRightKey) && maze?.[turnRightY]?.[turnRightX] !== ELEMENTS.WALL) {
      queue.push({
        position: [turnRightX, turnRightY],
        cost: currentNode.cost + COST.TURN + COST.MOVE,
        direction: turnRightDirection,
        parent: currentNode,
      });
    }
  }

  throw new Error('No path found');
}

const lowestCost = dijkstraBestPathByCost(start, end);

console.log('Result:', lowestCost);

console.log('-- PART 2 --');

const dijkstraAllBestPaths = (start, end, lowestCost) => {
  const grid = [...maze];

  const visited = new Map();
  const uniquePaths = new Set([start.join()]);
  
  const queue = [{
    position: [...start],
    cost: 0,
    direction: 'E',
    parent: null,
  }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    
    const currentNode = queue.shift();
    
    const key = [...currentNode.position, currentNode.direction].join();
  
    if (currentNode.cost > lowestCost) {
      continue;
    }
    
    if (visited.has(key) && (visited.get(key) < currentNode.cost)) {
      continue;
    }

    visited.set(key, currentNode.cost);

    if (
      currentNode.position[0] === end[0] &&
      currentNode.position[1] === end[1] &&
      currentNode.cost === lowestCost
    ) {
      uniquePaths.add(currentNode.position.join());
      let pathNode = currentNode.parent;
      while (pathNode.parent) {
        uniquePaths.add(pathNode.position.join());
        pathNode = pathNode.parent;
      }
      continue;
    }

    const [dx, dy] = DIRECTIONS[currentNode.direction];
    const [forwardX, forwardY] = [currentNode.position[0] + dx, currentNode.position[1] + dy];
    const forwardKey = [forwardX, forwardY, currentNode.direction].join();

    if (!visited.has(forwardKey) && grid?.[forwardY]?.[forwardX] !== ELEMENTS.WALL) {
      queue.push({
        position: [forwardX, forwardY],
        cost: currentNode.cost + COST.MOVE,
        direction: currentNode.direction,
        parent: currentNode,
      });
    }

    const turnLeftDirection = TURNS.LEFT[currentNode.direction];
    const [turnLeftdX, turnLeftdY] = DIRECTIONS[turnLeftDirection];
    const [turnLeftX, turnLeftY] = [currentNode.position[0] + turnLeftdX, currentNode.position[1] + turnLeftdY];
    const turnLeftKey = [turnLeftX, turnLeftY, turnLeftDirection].join();

    if (!visited.has(turnLeftKey) && maze?.[turnLeftY]?.[turnLeftX] !== ELEMENTS.WALL) {
      queue.push({
        position: [turnLeftX, turnLeftY],
        cost: currentNode.cost + COST.TURN + COST.MOVE,
        direction: turnLeftDirection,
        parent: currentNode,
      });
    }

    const turnRightDirection = TURNS.RIGHT[currentNode.direction];
    const [turnRightdX, turnRightdY] = DIRECTIONS[turnRightDirection];
    const [turnRightX, turnRightY] = [currentNode.position[0] + turnRightdX, currentNode.position[1] + turnRightdY];
    const turnRightKey = [turnRightX, turnRightY, turnRightDirection].join();

    if (!visited.has(turnRightKey) && maze?.[turnRightY]?.[turnRightX] !== ELEMENTS.WALL) {
      queue.push({
        position: [turnRightX, turnRightY],
        cost: currentNode.cost + COST.TURN + COST.MOVE,
        direction: turnRightDirection,
        parent: currentNode,
      });
    }
  }

  return uniquePaths;
}

const uniqueTiles = dijkstraAllBestPaths(start, end, lowestCost);

console.log('Result:', uniqueTiles.size);