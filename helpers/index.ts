import chalk from "chalk";
import fs from "node:fs"

import airportCodes from '../constants/countries.ts';
import { FlightEntry, Insights, reqParams } from "../types/index.ts";


export const CURRENT_YEAR = new Date().getFullYear()
//export function space(): void {console.log("\n")}


export async function saveToMarkdown(flightEntries: FlightEntry[], priceInsights: Insights, 
params: reqParams) {
  let {outbound, destination, departDate, returnDate} = params;

  //const departure = flightEntries[0].departure
  
  let mdContent = `# Flights to ${destination}\n\n`
  mdContent += `## From: ${outbound} -> ${destination}` 
  mdContent += `\nDate: ${departDate}\n\n`;

  mdContent += `## Price Insights\n\n`
  mdContent += `**Typical Price Range:**
  - $${priceInsights.priceRange[0]} - $${priceInsights.priceRange[1]}\n`

  mdContent += `- - ### Lowest Flight Price: $**${priceInsights.lowest_price}**\n`;
  mdContent += `- - ### Current Price Level: ${priceInsights.price_level.toUpperCase()}\n\n`;

  mdContent += `## Flights Table\n\n`;

  // Define column widths
  const colWidths = {
    origin: 7,       // 3 characters + 2 spaces on each side
    destination: 11, // 3 characters + 4 spaces on each side
    price: 8,        // 4-6 characters (including €) + 1 space on each side
    departure: 9,    // 5 characters + 2 spaces on each side
    arrival: 9        // 5 characters + 2 spaces on each side
  };

  // Helper function to center-align text
  function alignTextCenter(text: string, width: number) {
    const padding = width - text.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  };

  // Create header
  mdContent += `| ${'Origin'.padEnd(colWidths.origin)} | ${'Destination'.padEnd(colWidths.destination)} | ${'Price'.padEnd(colWidths.price)} | ${'Departure'.padEnd(colWidths.departure)} | ${'Arrival'.padEnd(colWidths.arrival)} |\n`;

  // Create separator
  mdContent += `|${'-'.repeat(colWidths.origin + 2)}|
  ${'-'.repeat(colWidths.destination + 2)}|${'-'.repeat(colWidths.price + 2)}|${'-'.repeat(colWidths.departure + 2)}|
  ${'-'.repeat(colWidths.arrival + 2)}|\n`;

  flightEntries.forEach(flight => {
    const originPadded = alignTextCenter(flight.origin, colWidths.origin);
    const destinationPadded = alignTextCenter(flight.destination, colWidths.destination);
    const pricePadded = `${flight.price}€`.padStart(5).padEnd(colWidths.price);
    const departurePadded = parseDateString(flight.departure ? flight.departure : departDate)
    .padEnd(colWidths.departure);
    const arrivalPadded = parseDateString(flight.arrival ? flight.arrival : returnDate)
    .padEnd(colWidths.arrival);

    mdContent += `| ${originPadded} | ${destinationPadded} | ${pricePadded} |
     ${departurePadded} | ${arrivalPadded} |\n`;
  })
  
  const filename = `${origin}_TO_${destination}___${departDate.replace(/\//g, '-')}.md`;
  const mdpath = `./md/flights/${filename}`

  //fs.writeFileSync(mdpath, mdContent)
  await Bun.write(
  Bun.file(mdpath),
  mdContent
  );

  console.log(chalk.green(`\nSaved flights to ${filename} at ${mdpath}`));
}
/* 
export function validateLocation(input: string) {
  let locations: string[] // = []

  if (isAirport(input)) {
    locations = [input.toUpperCase()];
  }
  else if (isCountry(input)) {
    locations = getAirPortsList(input);
  }
  return locations;
} */

// This function checks  wether date1 is set in a future (newer) date
// than date 2
export function assertFuture(date1: Date, date2: Date) {
  return date1.getTime() > date2.getTime() 
}



export function getAirPortsList(country: string) {
  const airports = airportCodes[country.toUpperCase()];
  if (!airports || airports.length === 0) {
    throw new Error(`No airports found in the list for ${country}`);
  }
  return airports;
}

export function isAirport(code: string): boolean {
  const codes = Object.values(airportCodes).flat();
  return codes.includes(code.toUpperCase());
}

export function isCountry(country: string): boolean {
  const countries = Object.keys(airportCodes);
  return countries.includes(country.toUpperCase());
}

export const parseDateString = (dateString: string) => {
  if (dateString === "NaN/NaN") return "N/A";

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}


export function formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


