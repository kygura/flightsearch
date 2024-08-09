

import { COUNTRIES_DB } from "../constants/airports";
import type { Airport } from "../constants/airports";



export function isAirport(apcode: string): boolean {
  let inputCode = apcode.toUpperCase()

  const codes: string[] = Object.values(COUNTRIES_DB).flatMap((country) =>
    country.airports.map((airport) => airport.code)
  );
  const cities: string[] = Object.values(COUNTRIES_DB).flatMap((country) =>
    country.airports.map((airport) => airport.city.toUpperCase())
  );
  return codes.includes(inputCode) || cities.includes(inputCode);
}


export function isCountry(country: string): boolean {
  const countryNames: string[] = Object.keys(COUNTRIES_DB);
  return countryNames.includes(country.toUpperCase());
}

export function extractAirports(country: string): Airport[] {
  const COUNTRY = country.toUpperCase();
  
  if ( isCountry(COUNTRY) ) {
    return COUNTRIES_DB[COUNTRY].airports;
  }
  throw new Error(`Country ${COUNTRY} not found`);
}

function extractCodes(airports: Airport[]): string[] {
  return airports.map((ap) => ap.code);
}

export function getListFromCountry(country: string): string[] {
  const airports = extractAirports(country);
  return extractCodes(airports);
}

export function validateInput(choice: string): Airport[] {
  if (isCountry(choice)) {
    const airports = extractAirports(choice);
    return  airports
  }
  if (isAirport(choice)) {
    return [{code: choice}]
  }
  throw new Error(`Invalid location: ${choice}`);
}



