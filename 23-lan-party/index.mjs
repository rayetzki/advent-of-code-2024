import { getFileInput } from '../utils.mjs';
import { REGEX } from '../common.mjs';

const input = await getFileInput('input.txt');

const networkGraph = input
  .split(REGEX.NEWLINE)
  .map((line) => line.split(REGEX.SEPARATOR))
  .reduce((acc, [first, second]) => {
    acc[first] ??= [];
    acc[second] ??= [];

    acc[first].push(second);
    acc[second].push(first);

    return acc;
  }, {});

console.log('-- PART 1 --');

const trios = new Set();

for (const [node, edges] of Object.entries(networkGraph)) {
  if (!node.startsWith('t')) continue;
  
  for (let i = 0; i < edges.length - 1; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      if (networkGraph[edges[j]].includes(edges[i])) {
        trios.add([node, edges[i], edges[j]].sort().join());
      }
    }
  }
}

console.log('Result:', trios.size);

console.log('-- PART 2 --');

// This array will store all possible cliques
const cliques = [];

// Bron-Kerbosch algorithm will be used to list all possible cliques

const bronKerboschAlgo = (result, potential, excluded) => {
  if (potential.size === 0 && excluded.size === 0) {
    cliques.push(result);
    return;
  }

  const nextPotential = new Set([...potential]);

  for (const vertex of potential) {
    const connections = new Set(networkGraph[vertex]);
    
    bronKerboschAlgo(
      result.union(new Set([vertex])),
      nextPotential.intersection(connections),
      excluded.intersection(connections),
    );

    nextPotential.delete(vertex);
  }
}

for (const [node, edges] of Object.entries(networkGraph)) {
  bronKerboschAlgo(new Set([node]), new Set(edges), new Set());
}

let biggestClique = new Set();

for (const clique of cliques) {
  if (clique.size > biggestClique.size) {
    biggestClique = clique;
  }
}

console.log('Result:', Array.from(biggestClique).sort().join())
