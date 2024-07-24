import { getJson } from "serpapi";
import ora from "ora";
import chalk from "chalk";

import { PriceInsights, searchParams, FlightResult, reqParams } from '../types/index.ts';
import { addNMonths } from "../tools/index.ts";


let API_KEY = process.env.SERPAPI_KEY || Bun.env.SERPAPI_KEY ||"7c204130bfbf46051307ac040c5ade70a4f33798782a4f8b683fea9d3c9ab40c"


async function fetchFlights(searchParams: reqParams) {
  
  const spinner = ora("Fetching flight data...").start();

  const {origin, destination, outboundDate, returnDate, travelNumber, length} = searchParams

  //if (returnDate == undefined) travelNumber = "1"
  const defParams : searchParams = {
    api_key: API_KEY,
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    currency: "EUR",
    outbound_date: outboundDate,
    type: travelNumber
  }



  async function attemptFetch(isRoundTrip: boolean) {
    if (!isRoundTrip) {
      defParams["return_date"] = addNMonths(outboundDate,2);
    }
    // Inject the following parameters if we wish to search for roundtrips
    if (isRoundTrip && returnDate != undefined) {
      defParams["return_date"] = returnDate
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

  //const isRoundTrip = travelNumber === "1";
  let isRoundTrip: boolean
  if (travelNumber == "1") isRoundTrip = true; else isRoundTrip = false

  let result: FlightResult = await attemptFetch(isRoundTrip);

    if (!result || (result.bestEntries.length === 0 && result.fallbackEntries.length === 0)) {
      spinner.text = `No ${isRoundTrip ? "roundtrip":"oneway"} flights found. Attempting again with ${!isRoundTrip ? "roundtrip" : "oneway"} flights.`;
      result = await attemptFetch(!isRoundTrip);
    }

  if (!result) {
    spinner.fail("Final Error:\n Must API error on the server");
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
