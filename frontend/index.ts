// External packages
import chalk from 'chalk';
import { Table } from "console-table-printer";

// Local imports
import { parseDateString } from '../tools';
import { FlightEntry, PriceInsights, reqParams } from '../types';


export function printFlights(flights: FlightEntry[],
params: reqParams): void {

  if (flights.length == 0) {
    console.log(chalk.blue("\nNo flights found"))
    return
  }

  let {outbound, destination, departDate, returnDate} = params;

  const flightsTable = new Table({
    columns: 
    [
      { name: "origin", title: "ORIGIN", alignment: "center" },
      { name: "destination", title: "DESTINATION", alignment: "center" },
      { name: "price", title: "PRICE", alignment: "center" },
      { name: "departure", title: "DEPARTURE", alignment: "center" },
      { name: "return", title: "RETURN", alignment: "center" },
    ],
    sort: (row1, row2) => row1.price - row2.price,
  })


  flights.forEach(flight => {

    let dateDisplay = chalk.bgBlack.italic.white

    const entry = {
      origin: chalk.magenta(flight.origin != null ? flight.origin: outbound),
      destination: chalk.cyan(flight.destination != null ? flight.destination: destination),
      price: chalk.green(`${flight.price} €`),
      
      departure: flight.departure != null ? 
      dateDisplay(parseDateString(flight.departure)) :
      parseDateString(departDate),

      return: flight.arrival != null ? 
      dateDisplay(parseDateString(flight.arrival)) :
      returnDate != null ?
      parseDateString(returnDate) : chalk.red("(N/A) ONEWAY"),
    }
    flightsTable.addRow(entry);
  
  });

  console.log("\n");
  flightsTable.printTable();
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



