// External packages
import chalk from 'chalk';
import { Table } from "console-table-printer";

// Local imports
import * as tools from "../tools";


import { FlightEntry, PriceInsights } from '../types';
import fetchFlights from "../api/old"


export function printFlights(inputFlights: FlightEntry[]): void {

  if (inputFlights.length === 0) {
    console.log(chalk.red.bold("No flights found"));
    return;
  }

  const table = new Table({
    columns: 
    [
      { name: "origin", title: "ORIGIN", alignment: "center" },
      { name: "destination", title: "DESTINATION", alignment: "center" },
      { name: "price", title: "PRICE", alignment: "right" },
      { name: "departure", title: "DEPARTURE", alignment: "center" },
      { name: "arrival", title: "ARRIVAL", alignment: "center" },
    ],
    sort: (row1, row2) => row1.price - row2.price,
  })

  const showDates = chalk.yellow.italic //.bgBlack

  inputFlights.forEach(flight => {
    const flightData = {
      origin: chalk.blue(flight.origin),
      destination: chalk.cyan(flight.destination),
      price: chalk.green(`${flight.price}€`),
      departure: flight.departure != "NaN/NaN" || flight.departure !== null ? 
      showDates(tools.parseDateString(flight.departure)) :chalk.red("N/A"),
      
      arrival: flight.arrival !== "NaN/NaN" ? showDates(tools.parseDateString(flight.arrival))
      :chalk.red("N/A"),
    }

    table.addRow(flightData);
  });

  console.log("\n");
  table.printTable();
}

export function printPriceInsights(insights: PriceInsights) {
  console.log(chalk.white(`\nTypical Price Range:`)
    + chalk.bgCyan.black(`\n$${insights.priceRange[0]} - $${insights.priceRange[1]}`));

  console.log(chalk.cyan.bold.underline("\nPrice Insights:"));
  console.log(chalk.white("\nLowest Price:") + chalk.green.bold(`\n${insights.lowest_price}€`));

  console.log(chalk.white(`\nPrice Level:`))
  const PRICE_LEVEL = insights.price_level.toUpperCase();

  switch (PRICE_LEVEL) {
  case "LOW":
    console.log(chalk.green(PRICE_LEVEL));
    break;
  case "TYPICAL":
    console.log(chalk.yellow(PRICE_LEVEL));
    break;
  case "HIGH":
    console.log(chalk.red(PRICE_LEVEL));
    break;

  // Not implemented / default case
  default:
    console.log(chalk.gray(PRICE_LEVEL));
  }

}

/* async function main(origin: string, dest: string, start: string) {
  console.log(chalk.yellow(`
    \nSearching flights for:\n${origin} ─> ${dest} from ${start}\n`));

  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(origin, dest, start);

  printPriceInsights(priceInsights);
  
  if (bestFlights && otherFlights) {
    printFlights(bestFlights || otherFlights)
  }

  tools.saveToMarkdown(bestFlights, priceInsights, origin, dest)
} */

//main("AGP", "AKL", "11/08/2024");

