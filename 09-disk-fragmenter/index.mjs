import { getFileInput } from '../utils.mjs';

const input = await getFileInput('input.txt');

console.log('-- PART 1 --');

const disk1 = [];

for (let i = 0; i < input.length; i++) {
  for (let j = parseInt(input[i]); j > 0; j--) {
    disk1.push(i % 2 === 0 ? (i / 2) : null);
  }
}

for (let i = disk1.length - 1; i >= 0; i--) {
  const freeSpaceIndex = disk1.indexOf(null);
  if (disk1[freeSpaceIndex] == null || freeSpaceIndex > i) continue;
  [disk1[freeSpaceIndex], disk1[i]] = [disk1[freeSpaceIndex], disk1[f]];
}

const checksum = disk1.reduce((acc, block, id) => {
  if (block === null) return acc;
  return acc + (id * block);
}, 0);

console.log('Result:', checksum);

console.log('-- PART 2 --');

const disk2 = [];

class Disk {
  constructor(size, initialData = null) {
    this.size = size;
    this.used = initialData === null ? 0 : size;
    this.data = new Array(size).fill(initialData);
  }

  get left() {
    return this.size - this.used;
  }

  add(data) {
    for (let i = 0; i < data.length; i++) {
      this.data[i + this.used] = data[i];
    }
    this.used += data.length;
  }

  clear() {
    this.used = 0;
    this.data.fill(null);
  }
}

for (let i = 0; i < input.length; i++) {
  const fileId = i % 2 === 0 ? (i / 2) : null;
  disk2.push(new Disk(parseInt(input[i]), fileId));
}

for (let b = disk2.length - 1; b >= 0; b -= 2) {
  for (let f = 1; f < b; f += 2) {
    if (disk2[f].left >= disk2[b].size) {
      disk2[f].add(disk2[b].data);
      disk2[b].clear();
      break;
    } 
  }
}

const checksum2 = disk2
  .flatMap((block) => block.data)
  .reduce((acc, block, id) => {
    if (block === null) return acc;
    return acc + (id * block);
  }, 0);

console.log('Result:', checksum2);