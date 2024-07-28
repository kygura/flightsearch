// Define interface types

export interface reqParams {
  outbound: string
  destination: string
  departDate: string 
  returnDate?: string | null
  tripNumber: "1" | "2"
  tripDuration?: number | null 
}

export interface apiParams {
  api_key: string
  engine: string
  departure_id: string
  arrival_id: string
  currency: string
  outbound_date: string
  return_date?: string | {}
  type: "1" | "2"
}


export interface FlightEntry {
  origin: string
  destination: string
  price: string
  departure: string
  arrival?: string
}

export interface FlightResult {
  bestEntries: any[]
  fallbackEntries: any[]
  jsonData: JSON | any
}

export interface Insights {
  priceRange: [number,number]  //Defines a 2-element array
  lowest_price: string
  price_level: string
}







