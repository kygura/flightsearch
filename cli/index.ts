import figlet from 'figlet';
import prompts from 'prompts';
import chalk from 'chalk';
import { intro, outro, text, confirm, spinner } from '@clack/prompts';
import { validateDate, compareDates, createTimeStamp } from "../tools/index.ts";
import { reqParams } from '../types/index.ts';
import fetchFlights from '../api/v2.ts';

import { printFlights, printPriceInsights } from '../frontend/index.ts';
import * as tools from '../tools/index.ts';

let s: ReturnType<typeof spinner> | null = null;

async function main() {
  console.log("\n")
  console.log(chalk.cyan(figlet.textSync('Atlas', {
    font: 'Slant',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    width: 100
  })));

  intro(chalk.blue.underline("Search flights from the terminal"));

  const origin = await text({
    message: 'Enter the origin airport code:',
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter airport code' : undefined,
  }) as string;

  const destination = await text({
    message: 'Enter the destination airport code:',
    validate: (value) => value.length !== 3 ? 'Please enter a valid 3-letter airport code' : undefined,
  }) as string;

  const simpleDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  let outboundDate: string;

  do {
    outboundDate = await text({
      message: 'Enter the outbound date (DD/MM/YYYY):',
      validate: (value) => {
        if (!simpleDateRegex.test(value)) {
          return 'Please enter a valid date in the format DD/MM/YYYY';
        }
        if (!validateDate(value)) {
          return 'Please enter a valid date';
        }
        return undefined;
      },
    }) as string
  } while (!validateDate(outboundDate));

  const isRoundTrip = await confirm({
    message: 'Is this a round-trip?',
  }) as boolean;

  let returnDate: string | undefined;

  if (isRoundTrip) {
    do {
      returnDate = await text({
        message: 'Enter the return date (DD/MM/YYYY):',
        validate: (value) => {
          if (!validateDate(value)) {
            return 'Please enter a valid date';
          }
          if (!simpleDateRegex.test(value)) {
            return 'Please enter a valid date in the format DD/MM/YYYY';
          }
          if (compareDates(value, outboundDate) <= 0) {
            return 'The return date must be set in the future (after the outbound date)';
          }
          return undefined;
        },
      }) as string;
    } while (!validateDate(returnDate) || compareDates(returnDate, outboundDate) <= 0);
  }

  const journeyLength = await prompts({
    type: 'number',
    name: 'value',
    message: 'Enter the duration of the trip (in days)',
    validate: value => value > 2 && value < 300 ? value : "Trip duration must be 1 < n < 365 days"
  });

  s = spinner();
  s.start('Searching for flights');

  const params: reqParams = {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    outboundDate: createTimeStamp(outboundDate),
    returnDate: returnDate != undefined ? createTimeStamp(returnDate) : undefined,
    travelNumber: isRoundTrip ? "1" : "2",
    length: journeyLength.value
  };
  console.log(params);

  s.stop('Search completed');
  //const data = await fetchFlights(params);

  const { bestFlights, otherFlights, priceInsights } = await fetchFlights(params);
  printPriceInsights(priceInsights);
  
  if (bestFlights && otherFlights) {
    printFlights(bestFlights || otherFlights)
    //printFlights(otherFlights)
  }

  tools.saveToMarkdown(bestFlights, priceInsights, params.origin, params.destination)

  outro(chalk.red.bold('Atlas has finished execution'))
}

// Handle graceful exit
function gracefulExit() {
  if (s) s.stop('Search interrupted');
  outro('Atlas was interrupted and will exit gracefully');
  process.exit(0);
}

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

main().catch(console.error);
