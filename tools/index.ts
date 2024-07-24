import fs from "node:fs"

import chalk from "chalk";


import { FlightEntry, PriceInsights } from "../types/index.ts";

export const CURRENT_YEAR = new Date().getFullYear()

export function createTimeStamp(dateParam: string): string {
  let [day, month] = dateParam.split('/');
  let fullDate = `${new Date().getFullYear()}-${month}-${day}`;
  let parsedDate = new Date(fullDate);
  const present = new Date();

  if (parsedDate < present) {
    return `${new Date().getFullYear() + 1}-${month}-${day}`;
  }
  return fullDate;
}

export function addNMonths(dateParam: string, monthplus: number): string {
  const [day, month] = dateParam.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  let returnDate = new Date(currentYear, month - 1, day);
  returnDate.setMonth(returnDate.getMonth() + monthplus);
  let newMonth = (returnDate.getMonth() + 1).toString().padStart(2, '0');
  let newDay = returnDate.getDate().toString().padStart(2, '0');
  return `${newDay}/${newMonth}`;
}

export const parseDateString = (dateString: string) => {
  if (dateString === "NaN/NaN") return "N/A";

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

export function saveToMarkdown(flightEntries: FlightEntry[], priceInsights: PriceInsights, 
origin: string, destination: string) {

  const depDate = flightEntries[0].departure
  
  let mdContent = `# Flights to ${destination}\n\n`
  mdContent += `## From: ${origin} -> ${destination} Date: ${depDate}\n\n`;

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
  mdContent += `| ${'Origin'.padEnd(colWidths.origin)} | ${'Destination'.padEnd(colWidths.destination)} | ${'Price'.padEnd(colWidths.price)} | ${'Departure'.padEnd(colWidths.departure)} | ${'Return'.padEnd(colWidths.arrival)} |\n`;

  // Create separator
  mdContent += `|${'-'.repeat(colWidths.origin + 2)}|
  ${'-'.repeat(colWidths.destination + 2)}|${'-'.repeat(colWidths.price + 2)}|${'-'.repeat(colWidths.departure + 2)}|
  ${'-'.repeat(colWidths.arrival + 2)}|\n`;

  flightEntries.forEach(flight => {
    const originPadded = alignTextCenter(flight.origin, colWidths.origin);
    const destinationPadded = alignTextCenter(flight.destination, colWidths.destination);
    const pricePadded = `${flight.price}€`.padStart(5).padEnd(colWidths.price);
    const departurePadded = parseDateString(flight.departure).padEnd(colWidths.departure);
    const arrivalPadded = parseDateString(flight.arrival).padEnd(colWidths.arrival);

    mdContent += `| ${originPadded} | ${destinationPadded} | ${pricePadded} | ${departurePadded} |\n`;
  })
  
  const filename = `${origin}_TO_${destination}___${depDate.replace(/\//g, '-')}.md`;
  const mdpath = `./md/${filename}`

  fs.writeFileSync(mdpath, mdContent)
  console.log(chalk.green(`\nSaved flight entries to ${filename}`));
}

export function validateDate(dateString: string): boolean {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

export function compareDates(date1: string, date2: string): number {
  const [day1, month1, year1] = date1.split('/').map(Number);
  const [day2, month2, year2] = date2.split('/').map(Number);
  return new Date(year1, month1 - 1, day1).getTime() - new Date(year2, month2 - 1, day2).getTime();
}
