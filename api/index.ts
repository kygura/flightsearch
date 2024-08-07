
import ora from "ora";
import chalk from "chalk";

import { getJson } from "serpapi";
import { Insights, apiParams, Result, reqParams, FlightEntry } from '../types/index.ts';

let API_KEY = Bun.env.SERPAPI_KEY || process.env.SERPAPI_KEY || null
if (!API_KEY) console.error(chalk.red("No API KEY set. \nAdd a SERPAPI_KEY to the .env file"));


async function fetchFlights(cliParams: reqParams) {
  
  const {outbound, destination, departDate, returnDate, tripNumber} = cliParams
  const oraspin = ora("Fetching flights...").start();

  // valid travel type numbers
  //  1  = roundtrips
  //  2  = oneways
  const defParams : apiParams = {
    api_key: API_KEY,
    engine: "google_flights",
    departure_id: outbound,
    arrival_id: destination,
    currency: "EUR",
    outbound_date: departDate,
    type: tripNumber
  }

  async function attemptFetch(tripN: string) {

    // Inject return_date property if it's a roundway
    if (tripN == "1" && returnDate != null) {
      defParams["return_date"] = returnDate
    }
    else if (tripN =="2" && defParams.return_date) {
      delete defParams.return_date
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

  let result: Result = await attemptFetch(tripNumber);

    if (!result || (result.bestEntries.length === 0 && result.fallbackEntries.length === 0)) {
      
      let isOneWay: boolean = tripNumber === "2";
      
      oraspin.text = `No ${isOneWay ? "oneway" : "roundtrip" } flights found. 
      Attempting again with ${!isOneWay ?  "roundtrip" : "oneway" } flights.`
      
      // Inverts the case 
      // Could've used a boolean but it's the same
      result = await attemptFetch(tripNumber == "2" ? "1" : "2");
    
    }

  if (!result) {
    oraspin.fail(chalk.red.bold("Final Error:\n Program terminated."))
    return { bestFlights: [], priceInsights: null, otherFlights: [] };
  }

  const { bestEntries, fallbackEntries, jsonData } = result;
  oraspin.succeed(chalk.green(`Found ${bestEntries.length + fallbackEntries.length} flights\n`))


  const processFlights = (entries) => entries.map(match => {
    const flights = match.flights || [];
    const originID = flights[0]?.departure_airport?.id || origin;
    const destID = flights[flights.length - 1]?.arrival_airport?.id || destination;
    const price = match.price || "N/A";
    const departure = flights[0]?.departure_airport?.time || "N/A";
    const arrival = flights.length > 1 ? flights[flights.length - 1]?.arrival_airport?.time : "N/A";
    return { originID, destID, price, departure, return: arrival };
  });

  const bestFlights = processFlights(bestEntries);
  const otherFlights = processFlights(fallbackEntries);

  const priceInsights: Insights = {
    priceRange: jsonData.price_insights?.typical_price_range || ["N/A", "N/A"],
    lowest_price: jsonData.price_insights?.lowest_price || "N/A",
    price_level: jsonData.price_insights?.price_level || "N/A"
  };

  return { bestFlights, priceInsights, otherFlights };
}

export default fetchFlights
