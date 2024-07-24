
import chalk from "chalk";

let header = ["ORIGIN", "DESTINATION", "LEAVES", "ARRIVES"];

let columnWidths = header.map(entry => entry.length); // Adding padding to each column width

function createLineOfChars(char, range) {
  let acc = "";
  for (let _ = 0; _ < range; _++) {
    acc += char;
  }
  return acc;
}

function dynamicRow(widthsArray) {
  let acc = "";
  for (let i in widthsArray) {
    acc += "─".repeat(widthsArray[i] +2) + "┬"; // Add ┬ for column separator
  }
  return acc.slice(0, -1); // Remove the last ┬
}

const dynamicLines = dynamicRow(columnWidths);
let borderTop = "╭" + dynamicLines + "╮";

console.log(chalk.bold(borderTop));

console.log(
  chalk("│") +
  header.map(entry => chalk.cyan(` ${entry} `)).join(chalk("│")) +
  chalk("│")
);