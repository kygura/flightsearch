// External packages
import chalk from 'chalk';
import { Table } from "console-table-printer";

// Local imports
import * as tools from "../tools";
import { FlightEntry, PriceInsights } from '../types';


export function printFlights(flights: FlightEntry[],outbound: string, dest: string): void {

  const table1 = new Table({
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

  flights.forEach(flight => {

    const entry = {
      origin: chalk.magenta(flight.origin === undefined ? outbound : flight.origin),
      destination: chalk.cyan(flight.destination === undefined ? dest : flight.destination),
      price: chalk.green(`${flight.price} €`),
      
      departure: flight.departure !== null ? 
      showDates(tools.parseDateString(flight.departure)) :chalk.red("N/A"),
      arrival: flight.arrival != undefined ? showDates(tools.parseDateString(flight.arrival))
      :chalk.red("N/A"),
    }

    table1.addRow(entry);
  });

  console.log("\n");
  table1.printTable();
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
  case "HIGH":
    console.log(chalk.red(PRICE_LEVEL));
    break;
  case "TYPICAL":
    console.log(chalk.black(PRICE_LEVEL));
    break;

  // Not implemented / default case
  default:
    console.log(chalk.gray(PRICE_LEVEL));
  }

}



