import chalk from 'chalk';
import figlet from 'figlet';


import { reqParams } from '../types/index.ts';
import fetchFlights from '../api/index.ts';

import { printFlights, printPriceInsights } from '../frontend/index.ts';

import { assertFuture, formatDate, saveToMarkdown } from "../tools/index.ts";

import { intro, outro, spinner, confirm} from '@clack/prompts';
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

  let msgwrapper = chalk.italic.white
  intro(msgwrapper.blackBright("A simple tool for flight-searching\n"));

  let w = await confirm({
    message: chalk.cyan('Initiate program?')
  })
  if (!w) userExit();

 
  const origin = await prompts({
    type: "text",
    name: "code1",
    mask: "AGP",
    initial: "AGP",
    message: msgwrapper.green('Enter the code for the outbound airport:'),
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  }); 

  const destination = await prompts({
    type: "text",
    name: "code2",
    initial: "AKL",
    message: msgwrapper.green('Enter the code for the destination airport:'),
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter code' : true,
  });

  let trip = await prompts({
    type: 'select',
      name: 'type',
      message: msgwrapper.black('Select travel method:\n'),
      hint: "You may search for oneway flights, or include return flights in your search",
      choices: [
        { title: 'Oneway', value: 'oneway' },
        { title: 'Roundtrip', value: 'roundtrip' },
      ],
      initial: 0,
    }
  )

  let outboundDate : Answers<string> = await prompts({
        message: msgwrapper.bgBlue('Enter the outbound date:'),
        type: "date",
        name: "start",
        mask: "YYYY-MM-DD",
    })


  let returnDate: Answers<string> = await prompts({
        // Will only display if we have confirmed for a roundtrip
        message: msgwrapper.bgBlue('Enter the return date:'),
        type: trip.type == "roundtrip" ? "date" : false,
        name: "end",
        mask: "YYYY-MM-DD",
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
  //printFlights(otherFlights,params) 
  
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


