import { CHARS, REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const input = await getFileInput('input.txt');

const OPCODES = {
  '0': 'adv',
  '1': 'bxl',
  '2': 'bst',
  '3': 'jnz',
  '4': 'bxc',
  '5': 'out',
  '6': 'bdv',
  '7': 'cdv'
};

const REGISTERS = { A: 0, B: 0, C: 0 };

const [registers, program] = input.split(REGEX.DOUBLE_NEWLINE);

const registerRegex = /Register (?<reg>[A-C]): (?<val>\d+)/;
const programRegex = /Program: (.+)/;

const initRegisters = () => {
  const regs = { ...REGISTERS };
  
  for (const register of registers.split(REGEX.NEWLINE)) {
    const { groups: { reg, val } } = register.match(registerRegex);
    regs[reg] = parseInt(val);
  };

  return regs;
}

const startInstructions = program.match(programRegex)[1].split(CHARS.COMMA);

console.log('-- PART 1 --');

const runProgram = (instructions, regs) => {
  const output = [];
  
  const getComboOperand = (value) => {
    if (value >= 0 && value <= 3) return value;
    if (value === 4) return regs.A;
    if (value === 5) return regs.B;
    if (value === 6) return regs.C;
  }
  
  let pointer = 0;
  
  while (pointer !== instructions.length) {
    const [opcode, operand] = [instructions[pointer], parseInt(instructions[pointer + 1])];

    switch (OPCODES[opcode]) {
      case 'adv': {
        const combo = getComboOperand(operand); 
        const numerator = regs.A;
        const denominator = 2 ** combo;
        regs.A = Math.trunc(numerator / denominator);
        pointer += 2;
        break;
      }

      case 'bxl': {
        regs.B = regs.B ^ operand;
        pointer += 2;
        break;
      }
      
      case 'bst': {
        const combo = getComboOperand(operand);
        regs.B = combo % 8;
        pointer += 2;
        break;
      }

      case 'jnz': {
        if (regs.A === 0) {
          pointer += 2;
        } else {
          pointer = operand;
        }
        break;
      }

      case 'bxc': {
        regs.B = regs.B ^ regs.C;
        pointer += 2;
        break;
      }

      case 'out': {
        const combo = getComboOperand(operand);
        output.push(combo % 8);
        pointer += 2;
        break;
      }

      case 'bdv': {
        const combo = getComboOperand(operand); 
        const numerator = regs.A;
        const denominator = 2 ** combo;
        regs.B = Math.trunc(numerator / denominator);
        pointer += 2;
        break;
      }

      case 'cdv': {
        const combo = getComboOperand(operand); 
        const numerator = regs.A;
        const denominator = 2 ** combo;
        regs.C = Math.trunc(numerator / denominator);
        pointer += 2;
        break;
      }

      default: {
        console.log('I should never come here', opcode, operand);
      }
    }
  }

  return output;
}

const initRegs = initRegisters();

const finalOutput = runProgram(startInstructions, { ...initRegs });

console.log('Result:', finalOutput.join(CHARS.COMMA));

console.log('-- PART 2 --');

const regs = { ...REGISTERS };

while (regs.A <= Number.MAX_SAFE_INTEGER) {
  const output = runProgram(startInstructions, { ...regs });

  if (output.join(CHARS.COMMA) === startInstructions.join(CHARS.COMMA)) {
    console.log('Result:', regs.A);
    break;
  }

  regs.A++;
}