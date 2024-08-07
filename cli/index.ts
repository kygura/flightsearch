// External packages
import chalk from 'chalk';
import { Table } from "console-table-printer";

// Local imports
import { FlightEntry, Insights, reqParams } from '../types';
import { parseDateString } from '../tools';


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

    let displayTime = chalk.white.bgBlack.underline.italic

    const entry = {
      origin: chalk.blue(flight.origin != null ? flight.origin: outbound),
      destination: chalk.cyan(flight.destination != null ? flight.destination: destination),
      price: chalk.green(`${flight.price} €`),
      
      departure: flight.departure != null ? 
      displayTime(parseDateString(flight.departure)) :
      displayTime(parseDateString(departDate)),

      return: flight.arrival != null ? 
      displayTime(parseDateString(flight.arrival)) :
      returnDate != null ?
      displayTime(parseDateString(returnDate)) : chalk.gray("NO RETURN"),
    }
    flightsTable.addRow(entry);
  
  });

  console.log("\n");
  flightsTable.printTable();
}

export function printPriceInsights(insights: Insights) {
  console.log(chalk.cyan.bold.underline("\nInsights:"));

  console.log(chalk.cyan(`\nTypical Prices:`)
  + chalk.bgCyan.black(
  `\n${insights.priceRange[0]}€ -- ${insights.priceRange[1]}€`));

  console.log(chalk.blue("\nLOWEST PRICE + LEVEL:") 
  + chalk.green(`\n${insights.lowest_price}€ \t`));

  const PRICE_LEVEL = insights.price_level.toUpperCase()

  switch (PRICE_LEVEL) {

  case "LOW":
    console.log(chalk.green(PRICE_LEVEL));
    break;
  case "HIGH":
    console.log(chalk.yellow(PRICE_LEVEL));
    break;

  // Catches the default case / typical
  default:
    console.log(chalk.black(PRICE_LEVEL));
    break;

  case "TYPICAL":
    console.log(chalk.black(PRICE_LEVEL));
    break;
  
  }
}



