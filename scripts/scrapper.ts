const puppeteer = require('puppeteer');


async function scrapeFlights(origin, destination, length_of_journey) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to Google Flights
  const url = `https://www.google.com/flights`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Input the search parameters
  await page.waitForSelector('input[placeholder="Where from?"]');
  await page.click('input[placeholder="Where from?"]');
  await page.keyboard.type(origin);
  await page.keyboard.press('Enter');

  await page.waitForSelector('input[placeholder="Where to?"]');
  await page.click('input[placeholder="Where to?"]');
  await page.keyboard.type(destination);
  await page.keyboard.press('Enter');

  // Wait for suggestions to load and select the first one
  await page.waitForTimeout(2000); // Adjust the delay as needed

  // Select departure date and return date based on length_of_journey
  // This part may need more sophisticated handling based on the date format and picker used by Google Flights
  // Here we assume some standard dates for simplicity
  await page.click('div[aria-label="Departure date"]');
  await page.keyboard.type('2023-07-01');
  await page.keyboard.press('Enter');

  await page.click('div[aria-label="Return date"]');
  await page.keyboard.type('2023-07-10');
  await page.keyboard.press('Enter');

  // Submit the search
  await page.click('button[aria-label="Search"]');

  // Wait for the results to load
  await page.waitForSelector('div[jsname="xwe8uf"]', { timeout: 60000 });

  // Extract flight data
  const flights = await page.evaluate(() => {
    const flightElements = document.querySelectorAll('div[jsname="xwe8uf"]');
    const flightData = [];
    flightElements.forEach(flight => {
      const price = flight.querySelector('div[jscontroller="s7sIvd"] > div > span').innerText;
      const duration = flight.querySelector('div[jsname="F57a3b"] > div:nth-child(2) > div:nth-child(1)').innerText;
      flightData.push({ price, duration });
    });
    return flightData;
  });

  // Sort flights by price and duration
  flights.sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
    const durationA = a.duration.split(' ').reduce((acc, val) => acc + (parseInt(val) || 0), 0);
    const durationB = b.duration.split(' ').reduce((acc, val) => acc + (parseInt(val) || 0), 0);

    return priceA - priceB || durationA - durationB;
  });

  await browser.close();
  return flights;
}

// Example usage
scrapeFlights('JFK', 'LAX', 7).then(flights => console.log(flights)).catch(console.error);
