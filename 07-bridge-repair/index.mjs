import { CHARS, REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const fileInput = await getFileInput('input.txt');

const OPERATORS = { PLUS: '+', MUL: '*' };

const calibrationData = fileInput
  .split(REGEX.NEWLINE)
  .map((line) => {
    const [result, ...operands] = line
      .replace(REGEX.SEPARATOR, '')
      .split(CHARS.SPACE)
      .map(Number);

    return { result, operands };
  }, 0);

const combinationsMap = new Map();

const getOperatorCombinations = (operators, operandsCount) => {
  if (combinationsMap.has(operandsCount)) {
    return combinationsMap.get(operandsCount);
  }

  let operatorCombinations = operators.map((op) => [op]);
  
  for (let i = 1; i < operandsCount - 1; i++) {
    operatorCombinations = operatorCombinations.flatMap(
      (combination) => operators.map((op) => [...combination, op]),
    );
  }

  combinationsMap.set(operandsCount, operatorCombinations);

  return operatorCombinations;
}

console.log('-- PART 1 --');

const part1 = calibrationData
  .reduce((acc, { result, operands }) => {
    const combinations = getOperatorCombinations(
      Object.values(OPERATORS),
      operands.length,
    );

    for (const combination of combinations) {
      let supposedResult = operands[0];

      for (const [i, operator] of combination.entries()) {
        if (operator === OPERATORS.PLUS) {
          supposedResult += operands[i + 1];
        } else if (operator === OPERATORS.MUL) {
          supposedResult *= operands[i + 1];
        }
      }

      if (supposedResult === result) {
        return acc + result;
      }
    }

    return acc;
  }, 0);

console.log('Result:', part1);

combinationsMap.clear();

console.log('-- PART 2 --');

const NEW_OPERATOR = {
  CONCAT: '||',
};

const part2 = calibrationData
  .reduce((acc, { result, operands }) => {
    const combinations = getOperatorCombinations(
      Object.values({ ...OPERATORS, ...NEW_OPERATOR }),
      operands.length,
    );

    for (const combination of combinations) {
      let supposedResult = operands[0];

      for (const [i, operator] of combination.entries()) {
        if (operator === OPERATORS.PLUS) {
          supposedResult += operands[i + 1];
        } else if (operator === OPERATORS.MUL) {
          supposedResult *= operands[i + 1];
        } else if (operator === NEW_OPERATOR.CONCAT) {
          supposedResult = parseInt(`${supposedResult}${operands[i + 1]}`);
        }
      }

      if (supposedResult === result) {
        return acc + result;
      }
    }

    return acc;
  }, 0);

console.log('Result:', part2);