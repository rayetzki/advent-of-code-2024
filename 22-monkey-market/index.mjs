import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const mix = (secret, value) => (secret ^ value) >>> 0;
const prune = (value) => value % 16777216;

const initialSecretPrices = input.split(REGEX.NEWLINE).map(Number);

const step = (value) => {
  value = prune(mix(value, value * 64));
  value = prune(mix(value, value / 32));
  value = prune(mix(value, value * 2048));
  return value;
}

console.log('-- PART 1 --');

const prices = [...initialSecretPrices];

const TOTAL_ROUNDS = 2000;

for (const [index, _] of prices.entries()) {
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    prices[index] = step(prices[index]);
  }
}

const part1 = prices.reduce((acc, price) => acc + price, 0);

console.log('Result:', part1);

console.log('-- PART 2 --');

const getPrice = (value) => parseInt(value.toString().at(-1));

const MAX_CHANGES = 2000;

const newPrices = [...initialSecretPrices];

const bananasPerSequence = {};

for (const [index, _] of newPrices.entries()) {
  const priceChanges = [];
  const sequences = new Set();

  for (let i = 0; i < MAX_CHANGES; i++) {
    const prevPrice = getPrice(newPrices[index]);
    const newSecret = step(newPrices[index]);
    const price = getPrice(newSecret);
    priceChanges.push(price - prevPrice);

    if (priceChanges.length > 4) priceChanges.shift();

    if (priceChanges.length === 4) {
      const key = priceChanges.join();
      if (!sequences.has(key)) {
        sequences.add(key);
        bananasPerSequence[key] ??= 0;
        bananasPerSequence[key] += price;
      }
    }

    newPrices[index] = newSecret;
  }
}

const part2 = Math.max(...Object.values(bananasPerSequence));

console.log('Result:', part2);
