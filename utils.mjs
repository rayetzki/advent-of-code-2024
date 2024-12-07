import { readFile } from 'node:fs/promises';
import { join, sep } from 'node:path';

export const getFileInput = async (filename) => {
  const [, absolutePath] = process.argv;
  const [dirname,] = absolutePath.split(sep).slice(-2);
  const filePath = join('./', dirname, filename);
  const fileInput = await readFile(filePath, { encoding: 'utf-8' });
  return fileInput;
}