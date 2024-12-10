import { getFileInput } from '../utils.mjs';
import { CHARS, REGEX } from '../common.mjs';

const fileInput = await getFileInput('input.txt');

const grid = fileInput.split(REGEX.NEWLINE);

const [WIDTH, HEIGHT] = [grid[0].length, grid.length];

const ELEMENTS = {
  AIR: '.'
};

const antennas = [];

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (grid[y][x] !== ELEMENTS.AIR) {
      antennas.push({
        char: grid[y][x],
        x,
        y
      });
    }
  }
}

const antiNodes = new Set();

console.log('-- PART 1 --');

for (const a of antennas) {
  for (const b of antennas) {
    if (a === b || a.char !== b.char) continue;
    
    const [deltaX, deltaY] = [b.x - a.x, b.y - a.y];
    const [antiNodeX, antiNodeY] = [b.x + deltaX, b.y + deltaY];

    if (
      antiNodeX < 0 ||
      antiNodeY < 0 ||
      antiNodeX >= WIDTH ||
      antiNodeY >= HEIGHT
    ) continue;

    antiNodes.add([antiNodeX, antiNodeY].join(CHARS.COMMA));
  }
}

console.log('Result:', antiNodes.size);

antiNodes.clear();

console.log('-- PART 2 --');

for (const a of antennas) {
  for (const b of antennas) {
    if (a === b || a.char !== b.char) continue;
    
    const [deltaX, deltaY] = [b.x - a.x, b.y - a.y];
    let [antiNodeX, antiNodeY] = [a.x, a.y];

    while (true) {
      antiNodeX += deltaX;
      antiNodeY += deltaY;

      if (
        antiNodeX < 0 ||
        antiNodeY < 0 ||
        antiNodeX >= WIDTH ||
        antiNodeY >= HEIGHT
      ) break;
  
      antiNodes.add([antiNodeX, antiNodeY].join(CHARS.COMMA));
    }
  }
}

console.log('Result:', antiNodes.size);