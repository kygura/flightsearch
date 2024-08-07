import { FlightEntry } from "../types";
import { reqParams } from "../types";
import fs from "node:fs"

export function parseDateString (dateString: string) {
  if (dateString == null) return "N/A";

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


// Checks wether date1 is set in a future/newer date 
// when compared to date2
// Returns a boolean
export function assertFuture(future: Date, past: Date): boolean {
  return future.getTime() > past.getTime() 
}



export async function saveToMarkdownFile(flightEntries: FlightEntry[],
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
    let originPadded = centerText(flight.origin ? flight.origin : outbound, widths.origin);
    let destinationPadded = centerText(flight.destination ? flight.destination : destination, widths.destination);
    let pricePadded = `${flight.price}€`.padStart(5).padEnd(widths.price);
    let departurePadded = parseDateString(flight.departure ? flight.departure : departDate)
    .padEnd(widths.departure);
    let arrivalPadded = parseDateString(flight.arrival ? flight.arrival : returnDate)
    .padEnd(widths.arrival);

    content += `| ${originPadded} | ${destinationPadded} | ${pricePadded} |
     ${departurePadded} | ${arrivalPadded} |\n`;
  })

  let filename = `${params.outbound}_${params.destination}
  _${flightEntries[0].price}.md`;
  let mdpath = `./md/${filename}`
  
  //fs.writeFileSync(mdpath, content)
  await Bun.write(
  Bun.file(mdpath),content)

}
