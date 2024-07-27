import chalk from 'chalk';
import figlet from 'figlet';


import { reqParams } from '../types/index.ts';
import fetchFlights from '../api/index.ts';

import { printFlights, printPriceInsights } from '../frontend/index.ts';

import { assertFuture, formatDate, saveToMarkdown } from "../tools/index.ts";

import { intro, outro, spinner} from '@clack/prompts';
import prompts from 'prompts';
import type { Answers } from 'prompts';


async function main() {
  console.log("\n")
  console.log(chalk.cyan(figlet.textSync('Atlas', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'fitted',
    width: 100
  })));

  intro(chalk.blue.italic("A simple tool to search for flights from the terminal\n"));

  const origin = await prompts({
    type: "text",
    name: "code1",
    mask: "AGP",
    initial: "AGP",
    message: 'Enter the code for the outbound airport:',
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  }); 

  const destination = await prompts({
    type: "text",
    name: "code2",
    initial: "AKL",
    message: 'Enter the code for the destination airport:',
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  });

  //let simpleDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  let outboundDate : Answers<string> = await prompts({
        type: "date",
        name: "start",
        mask: "YYYY-MM-DD",
        message: 'Enter the outbound date:',
    })


  /*   
    let isRoundTrip = await confirm({
    message: 'Is this a round-trip?',
  }) 
  */

  let trip = await prompts({
    type: 'select',
      name: 'type',
      message: 'Select travel method:\n ',
      choices: [
        { title: 'Oneway', value: 'oneway' },
        { title: 'Roundtrip', value: 'roundtrip' },
      ],
    hint: "Search for oneway flights, or include return flights in the search ?",
    initial: 1,
    }
  )


 /*  let journey: Answers<string> = await prompts({
    type: trip.type == "oneway" ? "number" : false,
    name: 'duration',
    message: 'Enter the duration of the trip (in days)',
    validate: value => value > 7 && value < 300 ? value : "duration n must be 7 < n < 365 days"
  }); */


  let returnDate: Answers<string> = await prompts({
        // Will only display if we have confirmed for a roundtrip
        type: trip.type == "roundtrip" ? "date" : false,
        name: "end",
        mask: "YYYY-MM-DD",
        message: 'Enter the return date:',
        validate: value => assertFuture(value, outboundDate.start) ? true 
        : "Date must be set in the future"
      })


  s = spinner();
  s.start('Searching for flights');

  const params: reqParams = {
    outbound: origin.code1.toUpperCase(),
    destination: destination.code2.toUpperCase(),
    departDate: formatDate(outboundDate.start),
    returnDate: returnDate.end != undefined ? formatDate(returnDate.end) : null,
    tripNumber: trip.type == "oneway" ? "2" : trip.type == "roundtrip" ? "1" : "2",
    //tripDuration: journey.duration != undefined ? journey.duration : null
  };
  
  console.log("Calling API with the following parameters:\n\n",params);
  finalize(params)

  s.stop(chalk.green('Search completed'));
  outro(chalk.cyan.bold('Atlas has finished execution'))
}

async function finalize(params: reqParams) {
  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(params);


  printPriceInsights(priceInsights);
  
  printFlights(bestFlights,params) 
  
  printFlights(otherFlights,params) 
  
  saveToMarkdown(bestFlights, priceInsights, params)

}


// Handle graceful exit
let s: ReturnType<typeof spinner> | null = null;

function userExit() {
    let exitMsg = chalk.red.italic('Program interrupted by user')
    if (s) s.stop(exitMsg);
    process.exit(0);
}

process.on('SIGINT', userExit);
process.on('SIGTERM', userExit);

main().catch((console.error));


