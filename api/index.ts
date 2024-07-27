import { getJson } from "serpapi";
import ora from "ora";
import chalk from "chalk";

import { PriceInsights, apiParams, FlightResult, reqParams } from '../types/index.ts';
import { addNMonths } from "../tools/index.ts";


let API_KEY = Bun.env.SERPAPI_KEY // || process.env.SERPAPI_KEY



async function fetchFlights(cliParams: reqParams) {
  
  const spinner = ora("Fetching flight data...").start();

  const {origin, destination, outboundDate, returnDate, tripNumber} = cliParams

  // travel type numbers
  //  1  = roundtrips
  //  2  = one-way
  const defParams : apiParams = {
    api_key: API_KEY,
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    currency: "EUR",
    outbound_date: outboundDate,
    type: tripNumber
  }



  async function attemptFetch(tripN: string) {

    // If it's a oneway
    if (tripN == "1" && returnDate !== null) {
      defParams["return_date"] = returnDate
    }

    if (tripN == "2") {
      //defParams["type"] = "2"

    }

    try {
      let jsonData = await getJson(defParams);

      const bestEntries = jsonData.best_flights || [];
      const fallbackEntries = jsonData.other_flights || [];

      return { bestEntries, fallbackEntries, jsonData }
    } catch (error) {
      console.error(`Error while calling fetching flights during the API call:\n`, error);
      return null;
    }
  }

  let result: FlightResult = await attemptFetch(tripNumber);

    if (!result || (result.bestEntries.length === 0 && result.fallbackEntries.length === 0)) {
        let isOneWay: boolean
        isOneWay = tripNumber === "2";
      
      spinner.text = `No ${isOneWay ? "oneway" : "roundtrip" } flights found. 
      Attempting again with ${!isOneWay ?  "roundtrip" : "oneway" } flights.`;
      
      // Inverts the case 
      // Could've used a boolean but it's the same
      result = await attemptFetch(tripNumber == "2" ? "1" : "2");
    
    }

  if (!result) {
    spinner.fail(chalk.red.bold("Final Error:\n Program terminated."))
    return { bestFlights: [], priceInsights: null, otherFlights: [] };
  }

  const { bestEntries, fallbackEntries, jsonData } = result;
  spinner.succeed(chalk.green(`Found ${bestEntries.length + fallbackEntries.length} flights\n`))


  const processFlights = (entries) => entries.map(match => {
    const flights = match.flights || [];
    const originID = flights[0]?.departure_airport?.id || origin;
    const destID = flights[flights.length - 1]?.arrival_airport?.id || destination;
    const price = match.price || "N/A";
    const departure = flights[0]?.departure_airport?.time || "N/A";
    const returnFlight = flights.length > 1 ? flights[flights.length - 1]?.arrival_airport?.time : "N/A";
    return { originID, destID, price, departure, return: returnFlight };
  });

  const bestFlights = processFlights(bestEntries);
  const otherFlights = processFlights(fallbackEntries);

  const priceInsights: PriceInsights = {
    priceRange: jsonData.price_insights?.typical_price_range || ["N/A", "N/A"],
    lowest_price: jsonData.price_insights?.lowest_price || "N/A",
    price_level: jsonData.price_insights?.price_level || "N/A"
  };

  return { bestFlights, priceInsights, otherFlights };
}

export default fetchFlights
