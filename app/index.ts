import chalk from 'chalk'
import figlet from 'figlet'
import { intro, spinner, confirm } from '@clack/prompts'
import prompts from 'prompts'


import { reqParams } from '../types/index.ts'
import { printFlights, printPriceInsights } from '../cli/index.ts'
import fetchFlights from '../api/index.ts'

import { assertFuture, formatDate, saveToMarkdownFile } from "../tools/index.ts"
import { validateInput, isAirport, isCountry } from "../helpers/index.ts"
import { Airport } from '../constants/airports.ts'

let crwapper = chalk.italic.blue
let msgErr = chalk.red.bold

let onCancel = () => {
  exit()
  return false
}

async function showAirportList(airports: Airport[]) {
  let res = await prompts({
    type: "select",
    name: "val",
    initial: 0,
    message: crwapper('Choose a destination airport:'),
    choices: airports.map(ap => (
      {
      title: `${ap.city != undefined ? ap.city : ">"} (${ap.code})`,
      value: ap.code
      }
    )),
    validate: value => value ? true : "Invalid selection."
  }, { onCancel })

  return res

}

async function app() {
  console.log("\n")
  let s = spinner()
  console.log(chalk.cyan(figlet.textSync('Atlas', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'fitted',
    width: 100
  })))

  intro(crwapper.blue("A cli flight-searching tool\n"))

  let outInput = await prompts({
    type: "text",
    name: "txt",
    initial: "AGP",
    message: crwapper('Enter the outbound country/airport:'),
    validate: value => isAirport(value) || isCountry(value) ? true : "Invalid outbound country/airport. Please try again."
  }, { onCancel })

  let outboundAirports: Airport[] = validateInput(outInput.txt)

  let outboundAP = await showAirportList(outboundAirports)


  let destInput = await prompts({
    type: "text",
    name: "val",
    initial: "LPA",
    message: crwapper('Enter the destination country/airport:'),
    validate: value => isAirport(value) || isCountry(value) || 
    value != outboundAP.val  ? true : "Invalid country/airport. Try again."
  }, { onCancel })

  let destinations: Airport[] = validateInput(destInput.val)
  let finalAirport = await showAirportList(destinations)

  let tripType = await prompts({
    type: 'select',
    name: 'n',
    message: crwapper('Select flight type:\n'),
    hint: "Select one-way or round-trip flights:",
    choices: [
      { title: 'Round-trip flight', value: '1' },
      { title: 'Oneway flight', value: '2' },
    ],
    initial: 1,
  }, { onCancel })

  let outDate = await prompts({
    message: crwapper('Enter the outbound date:'),
    type: "date",
    name: "d1",
    mask: "YYYY-MM-DD",
    validate: value => assertFuture(value, new Date()) ? true : 
    "Outbound date must be set in the future"
  }, { onCancel })

  let retDate = null

  if (tripType.n == '1') {
    retDate = await prompts({
      message: crwapper.green('Enter the return date for your round-trip flight:'),
      type: "date",
      name: "d2",
      mask: "YYYY-MM-DD",
      validate: value => assertFuture(value, outDate.d1) ? true : 
      "Return date must be set after the outbound date"
    }, { onCancel })
  }

  let params: reqParams = {
    outbound: outboundAP.val,
    destination: finalAirport.val,
    departDate: formatDate(outDate.d1),
    returnDate: retDate ? formatDate(retDate.d2) : null,
    tripNumber: tripType.n,
  }

  console.log(crwapper.blue("\nSaved following parameters:\n\n"), params)
  let search = await confirm({ message: crwapper("Perform search?") })

  if (search) {
    s.start('Searching for flights...')
    searchFlights(params).finally(() => {
      s.stop(chalk.green('SEARCH COMPLETED'))
    })
  }
}

async function searchFlights(params: reqParams) {
  let { bestFlights, otherFlights, priceInsights } = await fetchFlights(params)

  if (bestFlights.length == 0 && otherFlights.length == 0) {
    console.log(chalk.redBright("No flights found"))
    return
  }
  if (priceInsights) {
    printPriceInsights(priceInsights)
  }

  printFlights(bestFlights || otherFlights, params)

  try {
    await saveToMarkdownFile(bestFlights, params)
    let filename = `${params.outbound}_${params.destination}_${priceInsights.lowest_price}.md`
    console.log(chalk.green(`\nSaved flights to ${filename}\n`))
  } catch (err) {
    console.error(msgErr("[FS:ERROR] WHILE SAVING:\n", err))
  }
}

function exit() {
  console.log(msgErr("\n$ Program exited"))
  process.exit(0)
}

process.on('SIGINT', () => exit())
process.on('SIGTERM', () => exit())
process.stdin.on('end', () => exit())

app().catch((e) => {
  console.error(msgErr("[ERROR]:\n", e))
  exit()
})
