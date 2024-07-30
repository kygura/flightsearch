import chalk from 'chalk';
import figlet from 'figlet';
import { intro, spinner, confirm } from '@clack/prompts';
import prompts from 'prompts';
import type { Answers } from 'prompts';


import fetchFlights from '../api/index.ts';
import { assertFuture, formatDate, saveFlightsAsMarkdown, getAirPortsList, isAirport, isCountry } 
from "../helpers/index.ts";
import { reqParams } from '../types/index.ts';
import { printFlights, printPriceInsights } from '../cli/index.ts';

let errorWrapper = chalk.italic.red


function getLocation(choice: string): string[] {
  let locations: string[] // = []

  if (isAirport(choice)) {
    locations = [choice.toUpperCase()];
  }
  else if (isCountry(choice)) {
    locations = getAirPortsList(choice);
  }
  return locations;
}

async function app() {
  console.log("\n");
  
  console.log(chalk.cyan(figlet.textSync('Atlas', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'fitted',
    width: 100
  }))
  );
  const crwapper = chalk.italic.blue;
  intro(crwapper.bgCyan("A simple tool for flight-searching\n"));

  const s = spinner();

  const onCancel = () => {
    exit();
    return false;
  };

  const outInput = await prompts({
    type: "text",
    name: "value",
    initial: "AGP",
    message: crwapper('Enter the outbound country/airport:'),
  }, { onCancel });


  let outCodes: string[] = getLocation(outInput.value)
  const outAirport = await prompts({
    type: "select",
    name: "out",
    initial: 0,
    message: crwapper('Choose an airport:'),
    choices: outCodes.map(code => ({ title: code, value: code })),
  }, { onCancel });

  const destInput = await prompts({
    type: "text",
    name: "val",
    initial: "LPA",
    message: crwapper('Enter the destination country/airport:'),
  }, { onCancel });

  let destCodes: string[] = getLocation(destInput.val)
  const destAirport = await prompts({
    type: "select",
    name: "dest",
    initial: 0,
    message: crwapper('Choose an airport:'),
    choices: destCodes.map(code => ({ title: code, value: code })),
  }, { onCancel });

  const tripN = await prompts({
    type: 'select',
    name: 'type',
    message: crwapper.black('Select flight type:\n'),
    hint: "You may search for oneway flights, or include return flights in your search",
    choices: [
      { title: 'Round-trip flight', value: '1' },
      { title: 'Oneway flight', value: '2' },
    ],
    initial: 1,
  }, { onCancel });

  const outDate: Answers<string> = await prompts({
    message: crwapper.bgBlue('Enter the outbound date:'),
    type: "date",
    name: "start",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, new Date()) ? true : 
    "Date must be set in the future"
  }, { onCancel });

  const retDate: Answers<string> = await prompts({
    message: crwapper.bgBlue('Enter the return date:'),
    type: tripN.type === "1" ? "date" : false,
    name: "end",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, outDate.start) ? true : 
    "Date must be set after the outbound date"
  }, { onCancel });

  console.log("\n");

  const params: reqParams = {
    outbound: outAirport.out,
    destination: destAirport.dest,
    departDate: formatDate(outDate.start),
    returnDate: retDate.end ? formatDate(retDate.end) : null,
    tripNumber: tripN.type,
  };

  let search = await confirm({
  message: crwapper("Perform search ?")
  })

  if (search) {
  s.start('Searching for flights');
  //console.log(crwapper.blue("Calling the API with the following parameters:\n\n"), params);
    searchFlights(params).finally(() => {
    s.stop(chalk.green('SEARCH COMPLETED'));
    });
  }

}

async function searchFlights(params: reqParams) {
  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(params);

  if (bestFlights.length === 0 && otherFlights.length === 0) {
    console.log(chalk.redBright("No flights found"));
    return;
  }
  if (priceInsights) {
    printPriceInsights(priceInsights);
  }

  printFlights(bestFlights || otherFlights, params);

  // Save results in a file
  try {
  const filename = `${params.outbound}_${params.destination}
  _${params.departDate.replace(/\//g, '-')}.md`;
  const mdpath = `./md/${filename}`
  await saveFlightsAsMarkdown(bestFlights, params,mdpath);


  console.log(chalk.green(`\nSaved flights to ${filename} at ${mdpath}`));
  }
  catch (err) {console.error(errorWrapper("[ERROR] WHILE SAVING:\n", err))}
}


function exit() {
  console.log(chalk.red.italic("\n$ Program exited"));
  process.exit(0);
}

process.on('SIGINT', () => exit());
process.on('SIGTERM', () => exit());
process.stdin.on('end', () => exit());

app().catch((e) => {
  exit();
  console.error(e);
});
