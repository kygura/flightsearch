// External packages
import chalk from 'chalk';
import { Table } from "console-table-printer";

// Local imports
import { parseDateString } from '../tools';
import { FlightEntry, PriceInsights, reqParams } from '../types';


export function printFlights(flights: FlightEntry[],
fallbackParams: reqParams): void {

  let {outbound, destination, departDate, returnDate} = fallbackParams;

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

    let dateDisplay = chalk.white.bgBlack.underline.italic

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
      parseDateString(returnDate) : chalk.gray("ONEWAY"),
    }
    flightsTable.addRow(entry);
  
  });

  console.log("\n");
  flightsTable.printTable();
}

export function printPriceInsights(insights: PriceInsights) {
  console.log(chalk.cyan(`\nTypical Price Range:`)
    + chalk.bgCyan.black(`\n$${insights.priceRange[0]} - $${insights.priceRange[1]}`));

  console.log(chalk.cyan.bold.underline("\Insights:"));
  console.log(chalk.cyan("\nLowest Price:") + chalk.green(`\n${insights.lowest_price}€`));

  console.log(chalk.cyan(`\nPrice Level:`))

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
    console.log(chalk.black(PRICE_LEVEL));
  }

}



