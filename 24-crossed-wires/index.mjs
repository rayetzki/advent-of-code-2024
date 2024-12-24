import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const [initialWires, formulasLines] = input.split(REGEX.DOUBLE_NEWLINE);

const wires = new Map(
  initialWires.split(REGEX.NEWLINE).map((line) => {
    const [wire, initialValue] = line.split(REGEX.SEPARATOR);
    return [wire, parseInt(initialValue.trim())];
  }),
);

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
  wires.set(wire, calculateFormula(run(first), action, run(second)));
  return wires.get(wire);
}

for (const formula of Object.keys(formulas)) {
  run(formula);
}

const part1 = [...wires.keys()]
  .filter(wire => wire.startsWith('z'))
  .sort((a, b) => b.localeCompare(a))
  .reduce((acc, wire) => acc + wires.get(wire).toString(), '');

console.log('Result:', parseInt(part1, 2));

console.log('-- PART 2 --');