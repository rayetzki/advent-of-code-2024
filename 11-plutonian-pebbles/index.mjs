import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');
const stones = input.split(REGEX.SPACE).map(Number);

const cache = new Map();

const stoneRec = (stone, ticks) => {
  const key = `${ticks}-${stone}`;
  if (cache.has(key)) return cache.get(key);
  
  if (ticks === 0) return 1;

  let nextStone;

  if (stone === 0) {
    nextStone = [1];
  } else if (stone.toString().length % 2 == 0) {
    const stoneStr = stone.toString();
    const midIndex = stoneStr.length / 2;
    const [left, right] = [stoneStr.slice(0, midIndex), stoneStr.slice(midIndex)];
    nextStone = [Number(left), Number(right)];
  } else {
    nextStone = [stone * 2024];
  }

  const nextStonesResult = nextStone.reduce(
    (acc, stone) => acc + stoneRec(stone, ticks - 1),
    0,
  );

  cache.set(key, nextStonesResult);
  return nextStonesResult;
}

console.log('-- PART 1 --');

const part1 = stones.reduce((acc, stone) => {
  return acc + stoneRec(stone, 25);
}, 0);

console.log('Result:', part1);

console.log('-- PART2 --');

const part2 = stones.reduce((acc, stone) => {
  return acc + stoneRec(stone, 75);
}, 0);

console.log('Result:', part2);