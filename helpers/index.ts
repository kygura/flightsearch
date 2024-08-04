import chalk from "chalk";
import fs from "node:fs"

import { FlightEntry, Insights, reqParams } from "../types/index.ts";


import airportCodes from '../constants/countries.ts';

export const CURRENT_YEAR = new Date().getFullYear()
//export function space(): void {console.log("\n")}


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








export async function saveFlightsAsMarkdown(flightEntries: FlightEntry[],
params: reqParams) {
  let {outbound, destination, departDate, returnDate} = params;
  
  let content = `# Flights to ${destination}\n\n`
  content +=    `## From: ${outbound} -> ${destination}` 
  content += `\n ## Times: ${departDate} ${returnDate ? ` -> ${returnDate}` : ""}\n\n`;


  content += `## Flights Table\n\n`;

  // Helper function to center-align text
  function centerText(text: string, width: number) {
    const padding = width - text.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  };


  // Inject spaces into characters to size the title headers
  // "TITLE" -> "  {TITLE}  "
  
  let 
  originHeader = 'Origin'.padStart(2," ").padEnd(2," "),
  destinationHeader = "Destination".padStart(1," ").padEnd(1," "),
  priceHeader = 'Price'.padStart(3," ").padEnd(3," "),
  departureHeader = 'Departure'.padEnd(3," ").padStart(1," "),
  arrivalHeader = 'Arrival'.padStart(2," ").padEnd(2," ")

  const widths = {
    origin: originHeader.length,            // 3 characters + 2 spaces on each side
    destination: destinationHeader.length, // 3 characters + 4 spaces on each side
    price: priceHeader.length,             // 4-6 characters (including €) + 1 space on each side
    departure: departureHeader.length,    // 5 characters + 2 spaces on each side
    arrival: arrivalHeader.length        // 5 characters + 2 spaces on each side
  };

  content += `|${originHeader}|${destinationHeader}|${priceHeader}|${departureHeader}|${arrivalHeader}|\n`;

  // Create separator
  content += `|${'-'.repeat(originHeader.length)}|
  ${'-'.repeat(destinationHeader.length)}|${'-'.repeat(priceHeader.length)}|${'-'.repeat(departureHeader.length)}|${'-'.repeat(arrivalHeader.length)}|\n`;

  flightEntries.forEach(flight => {
    const originPadded = centerText(flight.origin ? flight.origin : outbound, widths.origin);
    const destinationPadded = centerText(flight.destination ? flight.destination : destination, widths.destination);
    const pricePadded = `${flight.price}€`.padStart(5).padEnd(widths.price);
    const departurePadded = parseDateString(flight.departure ? flight.departure : departDate)
    .padEnd(widths.departure);
    const arrivalPadded = parseDateString(flight.arrival ? flight.arrival : returnDate)
    .padEnd(widths.arrival);

    content += `| ${originPadded} | ${destinationPadded} | ${pricePadded} |
     ${departurePadded} | ${arrivalPadded} |\n`;
  })

  let filename = `${params.outbound}_${params.destination}
  _${params.departDate.replace(/\//g, '-')}.md`;
  let mdpath = `./md/${filename}`
  
  fs.writeFileSync(mdpath, content)
  //await Bun.write(
  //Bun.file(mdpath),
  //content
  //);
}
