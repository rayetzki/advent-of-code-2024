import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('test.txt');

const [initialWiresLines, formulasLines] = input.split(REGEX.DOUBLE_NEWLINE);

const initialWires = new Map(
  initialWiresLines.split(REGEX.NEWLINE).map((line) => {
    const [wire, initialValue] = line.split(': ');
    return [wire, parseInt(initialValue)];
  })
);

const wires = new Map(initialWires);

const formulas = formulasLines.split(REGEX.NEWLINE).reduce((acc, line) => {
  const [operands, result] = line.split(' -> ');
  const [first, action, second] = operands.split(REGEX.SPACE);
  return { ...acc, [result]: [first, action, second] };
}, {});

const calculateFormula = (first, action, second) => {
  switch (action) {
    case 'OR': return first | second;
    case 'AND': return first & second;
    case 'XOR': return first ^ second;
  }
}

console.log('-- PART 1 --');

const run = (wire) => {
  if (wires.has(wire)) return wires.get(wire);
  const [first, action, second] = formulas[wire];
  const result = calculateFormula(run(first), action, run(second));
  wires.set(wire, result);
  return result;
}

for (const formula of Object.keys(formulas)) {
  run(formula);
}

const part1 = [...wires.keys()]
  .filter(wire => wire.startsWith('z'))
  .sort((a, b) => b.localeCompare(a))
  .reduce((acc, wire) => acc + wires.get(wire).toString(), '');

console.log('Result:', parseInt(part1, 2));
