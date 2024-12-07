import { REGEX } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const fileInput = await getFileInput('input.txt');

const grid = fileInput.split(REGEX.NEWLINE);

const [WIDTH, HEIGHT] = [grid[0].length, grid.length];

console.log('-- PART 1 --');

const SEARCHWORD = 'XMAS';

let foundSearchWords = 0;

const generatePositions = (word, [x, y]) => {
  const searchWordParts = word.split('');
 
  const positions = new Array(8).fill([]);
  
  positions[0] = searchWordParts.map((_, index) => [y, x + index]); // horizontal
  positions[1] = searchWordParts.map((_, index) => [y, x - index]); // reverse horizontal
  positions[2] = searchWordParts.map((_, index) => [y + index, x]); // vertical
  positions[3] = searchWordParts.map((_, index) => [y - index, x]); // reverse vertical
  positions[4] = searchWordParts.map((_, index) => [y + index, x + index]); // diagonal (down-right)
  positions[5] = searchWordParts.map((_, index) => [y + index, x - index]); // diagonal (down-left)
  positions[6] = searchWordParts.map((_, index) => [y - index, x + index]); // diagonal (up-right) 
  positions[7] = searchWordParts.map((_, index) => [y - index, x - index]); // diagonal (up-left)
  
  return positions;
}

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (grid[y][x] === SEARCHWORD[0]) {
      const positions = generatePositions(SEARCHWORD, [x, y]);

      for (const position of positions) {
        const wordParts = position.map(([a, b]) => (grid?.[a]?.[b] ?? ''));

        if (wordParts.join('') === SEARCHWORD) {
          foundSearchWords++;
        }
      }
    }
  }
}

console.log('Result:', foundSearchWords);

console.log('-- PART 2 --');

const isWordCross = (word, grid, [x, y]) => {
  const [M, A, S] = word.split('');
  
  if (grid?.[y + 1]?.[x + 1] !== A) return false;

  const crossEdges = [
    (grid?.[y]?.[x] ?? ''),
    (grid?.[y]?.[x + 2] ?? ''),
    (grid?.[y + 2]?.[x] ?? ''),
    (grid?.[y + 2]?.[x + 2] ?? ''), 
  ];
  
  if (!crossEdges.every(edge => word.includes(edge))) return false;

  const variants = [
    [M, S, M, S],
    [S, M, S, M],
    [M, M, S, S],
    [S, S, M, M],
  ];

  return variants.some((variant) => variant.join('') === crossEdges.join(''));
}

let foundXSearchWords = 0;

const MAS = SEARCHWORD.slice(1);

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (isWordCross(MAS, grid, [x, y])) {
      foundXSearchWords++;
    };
  }
}

console.log('Result:', foundXSearchWords);