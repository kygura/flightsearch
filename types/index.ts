// Define types / interface

export interface FlightEntry {
  origin: string;
  destination: string;
  price: string;
  departure: string;
  arrival?: string;
}

export interface FlightResult {
  bestEntries: any[];
  fallbackEntries: any[];
  jsonData: any;
}

export interface PriceInsights {
  priceRange: [number,number];  //Defines a 2-element array
  lowest_price: string;
  price_level: string;
}

export interface searchParams {
  api_key: string;
  engine: string;
  departure_id: string;
  arrival_id: string;
  currency: string;
  outbound_date: string;
  return_date?: string;
  type: string;
}

export interface reqParams {
  origin: string
  destination: string
  travelNumber: string
  outboundDate: string 
  returnDate?: string | undefined
  length?: number
}





