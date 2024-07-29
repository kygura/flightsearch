import chalk from 'chalk';
import figlet from 'figlet';
import { intro, spinner, confirm } from '@clack/prompts';
import prompts from 'prompts';
import type { Answers } from 'prompts';


import fetchFlights from '../api/index.ts';
import { assertFuture, formatDate, saveToMarkdown, getAirPortsList, isAirport, isCountry } 
from "../helpers/index.ts";
import { reqParams } from '../types/index.ts';
import { printFlights, printPriceInsights } from '../cli/index.ts';


function validateLocation(input: string): string[] {
  let locations: string[] // = []

  if (isAirport(input)) {
    locations = [input.toUpperCase()];
  }
  else if (isCountry(input)) {
    locations = getAirPortsList(input);
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
  const msg = chalk.italic.white;
  intro(msg.bgCyan.white("A simple tool for flight-searching\n"));

  const s = spinner();

  const onCancel = () => {
    exit();
    return false;
  };

  const outInput = await prompts({
    type: "text",
    name: "value",
    initial: "AGP",
    message: msg.green('Enter the outbound country/airport:'),
  }, { onCancel });

  let outCodes: string[] = validateLocation(outInput.value)

  const outAirport = await prompts({
    type: "select",
    name: "outCode",
    initial: 0,
    message: msg.green('Choose an outbound airport:'),
    choices: outCodes.map(code => ({ title: code, value: code })),
  }, { onCancel });

  const destInput = await prompts({
    type: "text",
    name: "val",
    initial: "LPA",
    message: msg.green('Enter the destination country/airport:'),
  }, { onCancel });

  let destCodes: string[] = validateLocation(destInput.val)

  const destAirport = await prompts({
    type: "select",
    name: "destCode",
    initial: 0,
    message: msg.green('Choose a destination airport:'),
    choices: destCodes.map(code => ({ title: code, value: code })),
  }, { onCancel });

  const tripN = await prompts({
    type: 'select',
    name: 'type',
    message: msg.black('Select flight type:\n'),
    hint: "You may search for oneway flights, or include return flights in your search",
    choices: [
      { title: 'Oneway flight', value: '2' },
      { title: 'Round-trip flight', value: '1' },
    ],
    initial: 1,
  }, { onCancel });

  const outDate: Answers<string> = await prompts({
    message: msg.bgBlue('Enter the outbound date:'),
    type: "date",
    name: "start",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, new Date()) ? true : 
    "Date must be set in the future"
  }, { onCancel });

  const retDate: Answers<string> = await prompts({
    message: msg.bgBlue('Enter the return date:'),
    type: tripN.type === "1" ? "date" : false,
    name: "end",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, outDate.start) ? true : 
    "Date must be set after the outbound date"
  }, { onCancel });

  console.log("\n");

  const params: reqParams = {
    outbound: outAirport.outCode,
    destination: destAirport.destCode,
    departDate: formatDate(outDate.start),
    returnDate: retDate.end ? formatDate(retDate.end) : null,
    tripNumber: tripN.type,
  };

  console.log(msg.green("Calling the API with the following parameters:\n\n"), params);

  s.start('Searching for flights');
  finalize(params).finally(() => {
    s.stop(chalk.green('SEARCH COMPLETED'));
  });
}

async function finalize(params: reqParams) {
  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(params);

  if (bestFlights.length === 0 || otherFlights.length === 0) {
    console.log(chalk.redBright("No flights found"));
    return;
  }
  if (priceInsights) {
    printPriceInsights(priceInsights);
  }

  printFlights(bestFlights, params);
  await saveToMarkdown(bestFlights, priceInsights, params);
}

function exit() {
  console.log(chalk.red.italic(`\n$"Program exited"`));
  process.exit(0);
}

process.on('SIGINT', () => exit());
process.on('SIGTERM', () => exit());
process.stdin.on('end', () => exit());

app().catch((e) => {
  exit();
  console.error(e);
});
