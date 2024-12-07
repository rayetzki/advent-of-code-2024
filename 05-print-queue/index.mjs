import { REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const fileInput = await getFileInput('input.txt');

const [rulesLines, updateLines] = fileInput.split(REGEX.DOUBLE_NEWLINE);

const rules = rulesLines
  .split(REGEX.NEWLINE)
  .map(line => line.split(REGEX.SEPARATOR).map(Number))
  .reduce((acc, [left, right]) => {
    if (acc.has(left)) {
      const existingRules = acc.get(left);
      existingRules.push(right);
      return acc.set(left, existingRules);
    }
    return acc.set(left, [right]);
  }, new Map());

const updatesSequences = updateLines
  .split(REGEX.NEWLINE)
  .map(line => line.split(REGEX.SEPARATOR).map(Number))

console.log('-- PART 1 --');

const isInCorrectOrder = (page, pageIndex, sequence) => {
  const leftList = sequence.slice(0, pageIndex);
  const rightList = sequence.slice(pageIndex + 1);

  const allLeftBefore = leftList.every((eachLeft) => {
    return rules.get(eachLeft).includes(page);
  });

  const allRightAfter = rightList.every((eachRight) => {
    if (!rules.has(eachRight)) return true;
    return !rules.get(eachRight).includes(page);
  });

  return allLeftBefore && allRightAfter;
};

const middlePageSum = updatesSequences.reduce((acc, updateSequence) => {
  const isCorrect = updateSequence.every(isInCorrectOrder);

  if (isCorrect) {
    const middlePageIndex = Math.floor(updateSequence.length / 2);
    return acc + updateSequence[middlePageIndex];
  };

  return acc;
}, 0);

console.log('Result:', middlePageSum);

console.log('-- PART 2 --');

const correctUpdates = [];
const incorrectUpdates = [];

for (const updateSequence of updatesSequences) {
  if (updateSequence.every(isInCorrectOrder)) {
    correctUpdates.push(updateSequence);
  } else {
    incorrectUpdates.push(updateSequence);
  }
}

for (const incorrectUpdate of incorrectUpdates) {
  incorrectUpdate.sort((a, b) => {
    if (!rules.has(a)) return -1;
    return rules.get(a).includes(b) > 0 ? 1 : -1;
  });
}

const middlePageSumWithReorder = incorrectUpdates.reduce((acc, update) => {
  const middlePageIndex = Math.floor(update.length / 2);
  return acc + update[middlePageIndex];  
}, 0);

console.log('Result:', middlePageSumWithReorder);