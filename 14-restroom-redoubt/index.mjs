import { getFileInput } from '../utils.mjs';
import { REGEX, CHARS } from '../common.mjs';
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

const ROBOT_REGEX = /p=(?<pX>-?\d+)\,(?<pY>-?\d+) v=(?<vX>-?\d+)\,(?<vY>-?\d+)/;

const robots = [];

for (const line of input.split(REGEX.NEWLINE)) {
  const { groups: { pX, pY, vX, vY } } = line.match(ROBOT_REGEX);
  robots.push({
    start: [pX, pY].map(Number),
    velocity: [vX, vY].map(Number),
    end: Array(2).fill(null),
  });
}

const [WIDTH, HEIGHT] = [isTest ? 11 : 101, isTest ? 7 : 103];
const [middleX, middleY] = [isTest ? 5 : 50, isTest ? 3 : 51];

const getNextTilePosition = ([x, y], [velX, velY]) => {
  const nextCoords = Array(2).fill(0);

  const [nextX, nextY] = [x + velX, y + velY];
  
  nextCoords[0] = nextX < 0 ? WIDTH + nextX : nextX % WIDTH;
  nextCoords[1] = nextY < 0 ? HEIGHT + nextY : nextY % HEIGHT;

  return nextCoords;
}

const TICKS = 100;

for (const robot of robots) {
  let ticksLeft = TICKS;

  let [curX, curY] = [...robot.start];
  const [velX, velY] = robot.velocity;

  do {
    [curX, curY] = getNextTilePosition([curX, curY], [velX, velY]);
    ticksLeft--;
  } while (ticksLeft !== 0);

  robot.end[0] = curX;
  robot.end[1] = curY;
}

console.log('-- PART 1 --');

const calculateSafetyFactor = (robots) => {
  const { length: q1 } = robots.filter((robot) => robot.end[0] < middleX && robot.end[1] < middleY);
  const { length: q2 } = robots.filter((robot) => robot.end[0] < middleX && robot.end[1] > middleY);
  const { length: q3 } = robots.filter((robot) => robot.end[0] > middleX && robot.end[1] < middleY);
  const { length: q4 } = robots.filter((robot) => robot.end[0] > middleX && robot.end[1] > middleY);      
  return q1 * q2 * q3 * q4;
};

const part1 = calculateSafetyFactor(robots);

console.log('Result:', part1);

for (const robot of robots) {
  robot.end = [];
}

console.log('-- PART 2 --');

let minSeconds = 0;
const positions = new Set();

do {
  minSeconds++;
  positions.clear();

  for (const robot of robots) {
    const [velX, velY] = robot.velocity;
    const [curX, curY] =  [robot.end[0] ?? robot.start[0], robot.end[1] ?? robot.start[1]];
    const [nextX, nextY] = getNextTilePosition([curX, curY], [velX, velY]);
    robot.end[0] = nextX;
    robot.end[1] = nextY;
    positions.add([nextX, nextY].join(CHARS.COMMA));
  }
} while (positions.size !== robots.length);

console.log('Result:', minSeconds);