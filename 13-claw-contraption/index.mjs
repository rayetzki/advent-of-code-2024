import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const prizeMachines = input
  .split(REGEX.DOUBLE_NEWLINE)
  .map((line) => {
    const [aLine, bLine, pLine] = line.split(REGEX.NEWLINE);
    const { groups: { aX, aY } } = aLine.match(/Button A: X\+(?<aX>\d+), Y\+(?<aY>\d+)/);
    const { groups: { bX, bY } } = bLine.match(/Button B: X\+(?<bX>\d+), Y\+(?<bY>\d+)/);
    const { groups: { pX, pY } } = pLine.match(/Prize: X=(?<pX>\d+), Y=(?<pY>\d+)/);
    return {
      A: [Number(aX), Number(aY)],
      B: [Number(bX), Number(bY)],
      PRIZE: [Number(pX), Number(pY)],
    };
  });

console.log('-- PART 1 --');

const part1 = prizeMachines.reduce((acc, prizeMachine) => {
  const { A: [aX, aY], B: [bX, bY], PRIZE: [pX, pY] } = prizeMachine;
  const a = (pX * bY - pY * bX) / (aX * bY - aY * bX);
  const b = (aX * pY - aY * pX) / (aX * bY - aY * bX);
  return Number.isInteger(a) && Number.isInteger(b) ? acc + (3 * a + b) : acc;
}, 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const part2 = prizeMachines.reduce((acc, prizeMachine) => {
  prizeMachine.PRIZE[0] += Math.pow(10, 13);
  prizeMachine.PRIZE[1] += Math.pow(10, 13);

  const { A: [aX, aY], B: [bX, bY], PRIZE: [pX, pY] } = prizeMachine;
  const a = (pX * bY - pY * bX) / (aX * bY - aY * bX);
  const b = (aX * pY - aY * pX) / (aX * bY - aY * bX);
  return Number.isInteger(a) && Number.isInteger(b) ? acc + (3 * a + b) : acc;
}, 0);

console.log('Result:', part2);