import { getFileInput } from '../utils.mjs';

const FREE_SPACE = '.';

const input = await getFileInput('input.txt');

const getInitialDisk = () => {
  const unpackedDisk = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = parseInt(input[i]); j > 0; j--) {
      if (i % 2 === 0) {
        unpackedDisk.push(i / 2);
      } else {
        unpackedDisk.push(FREE_SPACE);
      }
    }
  }

  return unpackedDisk;
}

console.log('-- PART 1 --');

const disk1 = getInitialDisk();

for (let i = disk1.length - 1; i >= 0; i--) {
  const freeSpaceIndex = disk1.indexOf(FREE_SPACE);
  
  if (disk1[i] == FREE_SPACE || freeSpaceIndex > i) continue;

  disk1[freeSpaceIndex] = disk1[i];
  disk1[i] = FREE_SPACE;
}
const checksum = disk1.reduce((acc, block, id) => {
  if (block === FREE_SPACE) return acc;
  return acc + (id * block);
}, 0);

console.log('Result:', checksum);

console.log('-- PART 2 --');
