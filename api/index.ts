import { getJson } from "serpapi";
import ora from "ora";
import chalk from "chalk";

import { PriceInsights } from '../types'
import { createTimeStamp, addNMonths } from "../tools";

let API_KEY = Bun.env.SERPAPI_KEY || "KEY_DEFAULT"


export default async function fetchFlights(startID: string, destID: string,
  start: string, tripLength: number=1, end: string = "") {

  const spinner = ora("> Fetching flights...").start();

  let departsAt = createTimeStamp(start);
  let returnsAt = end ? createTimeStamp(end) : createTimeStamp(addNMonths(start, tripLength));
  let travelType = end ? "2" : "1";

  //Hardcoded oneway trips for now
  try {
    let jsonData = await getJson({
      api_key: API_KEY,
      engine: "google_flights",
      departure_id: startID,
      arrival_id: destID,
      currency: "EUR",
      outbound_date: departsAt,
      //return_date: returnsAt,
      type: "2"
    });

    const bestEntries = jsonData.best_flights || jsonData.other_flights || [];
    const fallbackEntries = jsonData.other_flights || [];
    const allFlights = bestEntries.length + fallbackEntries.length

    spinner.succeed(chalk.green.bold.underline(`Found ${allFlights} flights\n`));

    const bestFlights = bestEntries.map(match => {
      // For each entry match, assign the result to a new variable.
      const flights = match.flights || [];
      const origin = flights[0]?.departure_airport?.id || startID;
      const destination = flights[flights.length - 1]?.arrival_airport?.id || destID;
      const price = match.price || "N/A";
      const departure = flights[0]?.departure_airport?.time || "N/A";
      const returnFlight = flights[flights.length - 1]?.arrival_airport?.time || "N/A";
      return { origin, destination, price, departure, return: returnFlight };
    });

    const otherFlights = fallbackEntries.map(match => {
      const flights = match.flights || [];
      const origin = flights[0]?.departure_airport?.id || startID;
      const destination = flights[flights.length - 1]?.arrival_airport?.id || destID;
      const price = match.price || "N/A";
      const departure = flights[0]?.departure_airport?.time || "N/A";
      const returnFlight = flights[flights.length - 1]?.arrival_airport?.time || "N/A";
      return { origin, destination, price, departure, return: returnFlight };
    });


    const priceInsights: PriceInsights = {
      priceRange: jsonData.price_insights.typical_price_range,
      lowest_price: jsonData.price_insights.lowest_price,
      price_level: jsonData.price_insights.price_level
    };

    return { bestFlights,otherFlights,priceInsights };

  } catch (error) {
    spinner.fail("Error fetching flight data");
    console.error('\nError when calling the Serpapi API:\n', error);
    return { bestFlights: null, priceInsights: null, otherFlights: null };
  }
}

//export { fetchFlights };
