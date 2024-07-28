import chalk from 'chalk';
import figlet from 'figlet';
import { intro, spinner, confirm } from '@clack/prompts';
import prompts from 'prompts';
import type { Answers } from 'prompts';

import fetchFlights from '../api/index.ts';
import { reqParams } from '../types/index.ts';

import { printFlights, printPriceInsights } from '../cli/index.ts';
import { assertFuture, formatDate, saveToMarkdown } from "../helpers/index.ts";


async function app() {
  console.log("\n");
  console.log(chalk.cyan(figlet.textSync('Atlas', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'fitted',
    width: 100
  })));

  let msgwrapper = chalk.italic.white;
  let  s = spinner();
  intro(msgwrapper.bgCyan.white("A simple clitool for flight-searching\n"));

  const onCancel = () => {
    userExit();
    return false; // Return false to stop further prompting
  };
  
  let w = await confirm({
    message: chalk.cyan('Launch program ?')
    
  })
  if (!w) onCancel();

  const origin = await prompts({
    type: "text",
    name: "code1",
    mask: "AGP",
    initial: "AGP",
    message: msgwrapper.green('Enter the code for the outbound airport:'),
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  }, { onCancel });

  const destination = await prompts({
    type: "text",
    name: "code2",
    initial: "LPA",
    message: msgwrapper.green('\nEnter the code for the destination airport:'),
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  }, { onCancel });

  let trip = await prompts({
    type: 'select',
    name: 'type',
    message: msgwrapper.black('Select travel method:\n'),
    hint: "You may search for oneway flights, or include return flights in your search",
    choices: [
      { title: 'Oneway flight', value: 'oneway' },
      { title: 'Round-trip flight', value: 'roundtrip' },
    ],
    initial: 0,
  }, { onCancel });

  let outboundDate: Answers<string> = await prompts({
    message: msgwrapper.bgBlue('Enter the outbound date:'),
    type: "date",
    name: "start",
    mask: "YYYY-MM-DD",
  }, { onCancel });

  let returnDate: Answers<string> = await prompts({
    // Will only display if we have confirmed for a roundtrip
    type: trip.type == "roundtrip" ? "date" : false,
    message: msgwrapper.bgBlue('Enter the return date:'),
    name: "end",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, outboundDate.start) ? true : "Date must be set in the future"
  }, { onCancel });
  
  //space()
  console.log("\n")

  s.start('Searching for flights');

  const params: reqParams = {
    outbound: origin.code1.toUpperCase(),
    destination: destination.code2.toUpperCase(),
    departDate: formatDate(outboundDate.start),
    returnDate: returnDate.end != undefined ? formatDate(returnDate.end) : null,
    tripNumber: trip.type == "oneway" ? "2" : trip.type == "roundtrip" ? "1" : "2",
    //tripDuration: journey.duration != undefined ? journey.duration : null
  };

  console.log("Calling API with the following parameters:\n\n", params);

  finalize(params).finally(() => {
    s.stop(chalk.green('SEARCH COMPLETED'));
  });
}

async function finalize(params: reqParams) {
  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(params);

  if (bestFlights.length == 0 || otherFlights.length == 0) {
    console.log(chalk.redBright("No flights found"));
    return;
  }
  if (priceInsights) {
    printPriceInsights(priceInsights);
  }

  printFlights(bestFlights, params);
  //printFlights(otherFlights,params)
  saveToMarkdown(bestFlights, priceInsights, params);
}

// Handle graceful exit
function userExit() {
  let message = "Program exited by user"
  console.log(chalk.red.italic(`\n${message}`));
  process.exit(0);
}

process.on('SIGINT', () => userExit());
process.on('SIGTERM', () => userExit());

// Handle Ctrl + D (EOF)
process.stdin.on('end', () => userExit());

app().catch((e) => {
  userExit();
  //console.error(err);
});
