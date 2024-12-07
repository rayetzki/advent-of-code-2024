import { REGEX, CHARS } from '../common.mjs';
import { getFileInput } from '../utils.mjs';

const fileInput = await getFileInput('input.txt');

const reports = fileInput
  .split(REGEX.NEWLINE)
  .map((line) => line.split(CHARS.SPACE).map(Number));

const checkReport = (report) => {
  const difference = report.reduce((acc, _, levelIndex) => {
    if (levelIndex === report.length - 1) return acc;
    acc.push(report[levelIndex] - report[levelIndex + 1]);
    return acc;
  }, []);

  return difference.every((level) => (
    Math.sign(level) === Math.sign(difference.at(0)) &&
    Math.abs(level) >= 1 &&
    Math.abs(level) <= 3
  ));
}
  
console.log('-- PART 1 --');

const totalSafeReports = reports.reduce((acc, report) => {
  const isSafe = checkReport(report);
  return isSafe ? acc + 1 : acc;
}, 0);

console.log('Result:', totalSafeReports);

console.log('-- PART 2 --');

const totalSafeReportsWithDamping = reports.reduce((acc, report) => {
  const isAlreadySafe = checkReport(report);
  if (isAlreadySafe) return acc + 1;

  for (let i = 0; i < report.length; i++) {
    const isSafeDamped = checkReport([
      ...report.slice(0, i),
      ...report.slice(i + 1),
    ]);

    if (isSafeDamped) {
      return acc + 1
    };
  }

  return acc;
}, 0);

console.log('Result:', totalSafeReportsWithDamping);