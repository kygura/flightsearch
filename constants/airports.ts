
//airports.ts

export interface Airport {
  code: string;
  name?: string;
  city?: string;
  isMainHub?: boolean;
}

export interface Country {
  country: string;
  airports: Airport[];
}

export const COUNTRIES_DB: { [country: string]: Country } = {

  "US": {
    country: "United States",

    airports: [
      { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", isMainHub: true },
      { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", isMainHub: true },
      { code: "ORD", name: "O'Hare International Airport", city: "Chicago", isMainHub: true },
      { code: "DFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", isMainHub: true },
      { code: "JFK", name: "John F. Kennedy International Airport", city: "New York City", isMainHub: true }
    ]
  },
  "CANADA": {
    country: "Canada",
    airports: [
      { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", isMainHub: true },
      { code: "YVR", name: "Vancouver International Airport", city: "Vancouver", isMainHub: true },
      { code: "YYC", name: "Calgary International Airport", city: "Calgary", isMainHub: true },
      { code: "YUL", name: "Montréal-Pierre Elliott Trudeau International Airport", city: "Montreal", isMainHub: true },
      { code: "YOW", name: "Ottawa Macdonald-Cartier International Airport", city: "Ottawa", isMainHub: true }
    ]
  },
  "UK": {
    country: "United Kingdom",
    airports: [
      { code: "LHR", name: "London Heathrow Airport", city: "London", isMainHub: true },
      { code: "LGW", name: "London Gatwick Airport", city: "London", isMainHub: true },
      { code: "MAN", name: "Manchester Airport", city: "Manchester", isMainHub: true },
      { code: "STN", name: "London Stansted Airport", city: "London", isMainHub: true },
      { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", isMainHub: true }
    ]
  },
  "GERMANY": {
    country: "Germany",
    airports: [
      { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", isMainHub: true },
      { code: "MUC", name: "Munich Airport", city: "Munich", isMainHub: true },
      { code: "TXL", name: "Berlin Tegel Airport", city: "Berlin", isMainHub: true },
      { code: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", isMainHub: true },
      { code: "HAM", name: "Hamburg Airport", city: "Hamburg", isMainHub: true }
    ]
  },
  "FRANCE": {
    country: "France",
    airports: [
      { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", isMainHub: true },
      { code: "ORY", name: "Orly Airport", city: "Paris", isMainHub: true },
      { code: "NCE", name: "Nice Côte d'Azur Airport", city: "Nice", isMainHub: true },
      { code: "LYS", name: "Lyon-Saint Exupéry Airport", city: "Lyon", isMainHub: true },
      { code: "MRS", name: "Marseille Provence Airport", city: "Marseille", isMainHub: true }
    ]
  },
  "CHINA": {
    country: "China",
    airports: [
      { code: "PEK", name: "Beijing Capital International Airport", city: "Beijing", isMainHub: true },
      { code: "PVG", name: "Shanghai Pudong International Airport", city: "Shanghai", isMainHub: true },
      { code: "CAN", name: "Guangzhou Baiyun International Airport", city: "Guangzhou", isMainHub: true },
      { code: "HGH", name: "Hangzhou Xiaoshan International Airport", city: "Hangzhou", isMainHub: false },
      { code: "SZX", name: "Shenzhen Bao'an International Airport", city: "Shenzhen", isMainHub: false }
    ]
  },
  "JAPAN": {
    country: "Japan",
    airports: [
      { code: "NRT", name: "Narita International Airport", city: "Tokyo", isMainHub: true },
      { code: "HND", name: "Haneda Airport", city: "Tokyo", isMainHub: true },
      { code: "KIX", name: "Kansai International Airport", city: "Osaka", isMainHub: true },
      { code: "NGO", name: "Chubu Centrair International Airport", city: "Nagoya", isMainHub: true },
      { code: "FUK", name: "Fukuoka Airport", city: "Fukuoka", isMainHub: false }
    ]
  },
  "INDIA": {
    country: "India",
    airports: [
      { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", isMainHub: true },
      { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", isMainHub: true },
      { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", isMainHub: true },
      { code: "MAA", name: "Chennai International Airport", city: "Chennai", isMainHub: true },
      { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", isMainHub: false }
    ]
  },
  "AUSTRALIA": {
    country: "Australia",
    airports: [
      { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", isMainHub: true },
      { code: "MEL", name: "Melbourne Airport", city: "Melbourne", isMainHub: true },
      { code: "BNE", name: "Brisbane Airport", city: "Brisbane", isMainHub: true },
      { code: "PER", name: "Perth Airport", city: "Perth", isMainHub: false },
      { code: "ADL", name: "Adelaide Airport", city: "Adelaide", isMainHub: false }
    ]
  },
  "BRAZIL": {
    country: "Brazil",
    airports: [
      { code: "GRU", name: "São Paulo/Guarulhos–Governador André Franco Montoro International Airport", city: "São Paulo", isMainHub: true },
      { code: "GIG", name: "Rio de Janeiro/Galeão–Antonio Carlos Jobim International Airport", city: "Rio de Janeiro", isMainHub: true },
      { code: "BSB", name: "Brasília International Airport", city: "Brasília", isMainHub: true },
      { code: "CGH", name: "São Paulo–Congonhas Airport", city: "São Paulo", isMainHub: false },
      { code: "SDU", name: "Santos Dumont Airport", city: "Rio de Janeiro", isMainHub: false }
    ]
  },
  "SOUTH AFRICA": {
    country: "South Africa",
    airports: [
      { code: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", isMainHub: true },
      { code: "CPT", name: "Cape Town International Airport", city: "Cape Town", isMainHub: true },
      { code: "DUR", name: "King Shaka International Airport", city: "Durban", isMainHub: true },
      { code: "PLZ", name: "Port Elizabeth International Airport", city: "Port Elizabeth", isMainHub: false },
      { code: "ELS", name: "East London Airport", city: "East London", isMainHub: false }
    ]
  },
  "RUSSIA": {
    country: "Russia",
    airports: [
      { code: "SVO", name: "Sheremetyevo International Airport", city: "Moscow", isMainHub: true },
      { code: "DME", name: "Domodedovo International Airport", city: "Moscow", isMainHub: true },
      { code: "LED", name: "Pulkovo Airport", city: "Saint Petersburg", isMainHub: true },
      { code: "VKO", name: "Vnukovo International Airport", city: "Moscow", isMainHub: false },
      { code: "KUF", name: "Kurumoch International Airport", city: "Samara", isMainHub: false }
    ]
  },
  "MEXICO": {
    country: "Mexico",
    airports: [
      { code: "MEX", name: "Mexico City International Airport", city: "Mexico City", isMainHub: true },
      { code: "CUN", name: "Cancún International Airport", city: "Cancún", isMainHub: true },
      { code: "GDL", name: "Guadalajara International Airport", city: "Guadalajara", isMainHub: true },
      { code: "MTY", name: "Monterrey International Airport", city: "Monterrey", isMainHub: true },
      { code: "TIJ", name: "Tijuana International Airport", city: "Tijuana", isMainHub: false }
    ]
  },
  "ITALY": {
    country: "Italy",
    airports: [
      { code: "FCO", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", isMainHub: true },
      { code: "MXP", name: "Milan Malpensa Airport", city: "Milan", isMainHub: true },
      { code: "VCE", name: "Venice Marco Polo Airport", city: "Venice", isMainHub: true },
      { code: "NAP", name: "Naples International Airport", city: "Naples", isMainHub: false },
      { code: "BLQ", name: "Bologna Guglielmo Marconi Airport", city: "Bologna", isMainHub: false }
    ]
  },
  "SPAIN": {
    country: "Spain",
    airports: [
      { code: "AGP", name: "Málaga Airport", city: "Málaga", isMainHub: true },
      { code: "LPA", name: "Gran Canaria Airport", city: "Gran Canaria", isMainHub: true },
      { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", isMainHub: true },
      { code: "BCN", name: "Barcelona–El Prat Airport", city: "Barcelona", isMainHub: true }
    ]
  },
  "UAE": {
    country: "United Arab Emirates",
    airports: [
      { code: "DXB", name: "Dubai International Airport", city: "Dubai", isMainHub: true },
      { code: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", isMainHub: true },
      { code: "SHJ", name: "Sharjah International Airport", city: "Sharjah", isMainHub: false },
      { code: "DWC", name: "Al Maktoum International Airport", city: "Dubai", isMainHub: false },
      { code: "RKT", name: "Ras Al Khaimah International Airport", city: "Ras Al Khaimah", isMainHub: false }
    ]
  },
  "TURKEY": {
    country: "Turkey",
    airports: [
      { code: "IST", name: "Istanbul Airport", city: "Istanbul", isMainHub: true },
      { code: "SAW", name: "Sabiha Gökçen International Airport", city: "Istanbul", isMainHub: true },
      { code: "AYT", name: "Antalya Airport", city: "Antalya", isMainHub: true },
      { code: "ESB", name: "Ankara Esenboğa Airport", city: "Ankara", isMainHub: false },
      { code: "ADB", name: "Adnan Menderes Airport", city: "Izmir", isMainHub: false }
    ]
  },
  "NETHERLANDS": {
    country: "Netherlands",
    airports: [
      { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", isMainHub: true },
      { code: "RTM", name: "Rotterdam The Hague Airport", city: "Rotterdam", isMainHub: false },
      { code: "EIN", name: "Eindhoven Airport", city: "Eindhoven", isMainHub: false },
      { code: "GRQ", name: "Groningen Airport Eelde", city: "Groningen", isMainHub: false },
      { code: "MST", name: "Maastricht Aachen Airport", city: "Maastricht", isMainHub: false }
    ]
  },
  "SWITZERLAND": {
    country: "Switzerland",
    airports: [
      { code: "ZRH", name: "Zurich Airport", city: "Zurich", isMainHub: true },
      { code: "GVA", name: "Geneva Airport", city: "Geneva", isMainHub: true },
      { code: "BSL", name: "EuroAirport Basel-Mulhouse-Freiburg", city: "Basel", isMainHub: true },
      { code: "BRN", name: "Bern Airport", city: "Bern", isMainHub: false },
      { code: "LUG", name: "Lugano Airport", city: "Lugano", isMainHub: false }
    ]
  },
  "SINGAPORE": {
    country: "Singapore",
    airports: [
      { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", isMainHub: true }
    ]
  },
  "HONG KONG": {
    country: "Hong Kong",
    airports: [
      { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", isMainHub: true }
    ]
  },
  "SOUTH KOREA": {
    country: "South Korea",
    airports: [
      { code: "ICN", name: "Incheon International Airport", city: "Incheon", isMainHub: true },
      { code: "GMP", name: "Gimpo International Airport", city: "Seoul", isMainHub: true },
      { code: "PUS", name: "Gimhae International Airport", city: "Busan", isMainHub: false },
      { code: "CJU", name: "Jeju International Airport", city: "Jeju", isMainHub: false },
      { code: "TAE", name: "Daegu International Airport", city: "Daegu", isMainHub: false }
    ]
  },
  "NEW ZEALAND": {
    country: "New Zealand",
    airports: [
      { code: "AKL", name: "Auckland Airport", city: "Auckland", isMainHub: true },
      { code: "WLG", name: "Wellington International Airport", city: "Wellington", isMainHub: true },
      { code: "CHC", name: "Christchurch International Airport", city: "Christchurch", isMainHub: true },
      { code: "ZQN", name: "Queenstown Airport", city: "Queenstown", isMainHub: false },
      { code: "DUD", name: "Dunedin Airport", city: "Dunedin", isMainHub: false }
    ]
  },
  "INDONESIA": {
    country: "Indonesia",
    airports: [
      { code: "CGK", name: "Soekarno–Hatta International Airport", city: "Jakarta", isMainHub: true },
      { code: "DPS", name: "Ngurah Rai International Airport", city: "Denpasar", isMainHub: true },
      { code: "SUB", name: "Juanda International Airport", city: "Surabaya", isMainHub: true },
      { code: "MES", name: "Kualanamu International Airport", city: "Medan", isMainHub: false },
      { code: "JOG", name: "Adisutjipto International Airport", city: "Yogyakarta", isMainHub: false }
    ]
  },
  "MALAYSIA": {
    country: "Malaysia",
    airports: [
      { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", isMainHub: true },
      { code: "LGK", name: "Langkawi International Airport", city: "Langkawi", isMainHub: false },
      { code: "PEN", name: "Penang International Airport", city: "Penang", isMainHub: false },
      { code: "BKI", name: "Kota Kinabalu International Airport", city: "Kota Kinabalu", isMainHub: false },
      { code: "KCH", name: "Kuching International Airport", city: "Kuching", isMainHub: false }
    ]
  },
  "THAILAND": {
    country: "Thailand",
    airports: [
      { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", isMainHub: true },
      { code: "DMK", name: "Don Mueang International Airport", city: "Bangkok", isMainHub: true },
      { code: "HKT", name: "Phuket International Airport", city: "Phuket", isMainHub: true },
      { code: "CNX", name: "Chiang Mai International Airport", city: "Chiang Mai", isMainHub: false },
      { code: "CEI", name: "Chiang Rai International Airport", city: "Chiang Rai", isMainHub: false }
    ]
  },
  "VIETNAM": {
    country: "Vietnam",
    airports: [
      { code: "SGN", name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", isMainHub: true },
      { code: "HAN", name: "Noi Bai International Airport", city: "Hanoi", isMainHub: true },
      { code: "DAD", name: "Da Nang International Airport", city: "Da Nang", isMainHub: false },
      { code: "CXR", name: "Cam Ranh International Airport", city: "Nha Trang", isMainHub: false },
      { code: "HPH", name: "Cat Bi International Airport", city: "Haiphong", isMainHub: false }
    ]
  },
  "PHILIPPINES": {
    country: "Philippines",
    airports: [
      { code: "MNL", name: "Ninoy Aquino International Airport", city: "Manila", isMainHub: true },
      { code: "CEB", name: "Mactan-Cebu International Airport", city: "Cebu", isMainHub: true },
      { code: "DVO", name: "Francisco Bangoy International Airport", city: "Davao", isMainHub: false },
      { code: "CRK", name: "Clark International Airport", city: "Angeles", isMainHub: false },
      { code: "ILO", name: "Iloilo International Airport", city: "Iloilo", isMainHub: false }
    ]
  },
  "PAKISTAN": {
    country: "Pakistan",
    airports: [
      { code: "KHI", name: "Jinnah International Airport", city: "Karachi", isMainHub: true },
      { code: "LHE", name: "Allama Iqbal International Airport", city: "Lahore", isMainHub: true },
      { code: "ISB", name: "Islamabad International Airport", city: "Islamabad", isMainHub: true },
      { code: "PEW", name: "Bacha Khan International Airport", city: "Peshawar", isMainHub: false },
      { code: "MUX", name: "Multan International Airport", city: "Multan", isMainHub: false }
    ]
  },
  "BANGLADESH": {
    country: "Bangladesh",
    airports: [
      { code: "DAC", name: "Shahjalal International Airport", city: "Dhaka", isMainHub: true },
      { code: "CGP", name: "Shah Amanat International Airport", city: "Chittagong", isMainHub: false },
      { code: "ZYL", name: "Osmani International Airport", city: "Sylhet", isMainHub: false },
      { code: "CXB", name: "Cox's Bazar Airport", city: "Cox's Bazar", isMainHub: false },
      { code: "JSR", name: "Jessore Airport", city: "Jessore", isMainHub: false }
    ]
  },
  "SRI LANKA": {
    country: "Sri Lanka",
    airports: [
      { code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", isMainHub: true },
      { code: "HRI", name: "Mattala Rajapaksa International Airport", city: "Hambantota", isMainHub: false },
      { code: "BTC", name: "Batticaloa Airport", city: "Batticaloa", isMainHub: false },
      { code: "JAF", name: "Jaffna International Airport", city: "Jaffna", isMainHub: false },
      { code: "KCT", name: "Koggala Airport", city: "Koggala", isMainHub: false }
    ]
  },
  "SAUDI ARABIA": {
    country: "Saudi Arabia",
    airports: [
      { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", isMainHub: true },
      { code: "RUH", name: "King Khalid International Airport", city: "Riyadh", isMainHub: true },
      { code: "DMM", name: "King Fahd International Airport", city: "Dammam", isMainHub: true },
      { code: "MED", name: "Prince Mohammad bin Abdulaziz International Airport", city: "Medina", isMainHub: false },
      { code: "TIF", name: "Ta'if Regional Airport", city: "Ta'if", isMainHub: false }
    ]
  },
  "ISRAEL": {
    country: "Israel",
    airports: [
      { code: "TLV", name: "Ben Gurion Airport", city: "Tel Aviv", isMainHub: true },
      { code: "SDV", name: "Sde Dov Airport", city: "Tel Aviv", isMainHub: false },
      { code: "ETH", name: "Eilat Airport", city: "Eilat", isMainHub: false },
      { code: "RPN", name: "Rosh Pina Airport", city: "Rosh Pina", isMainHub: false },
      { code: "VDA", name: "Ovda Airport", city: "Ovda", isMainHub: false }
    ]
  },
  "QATAR": {
    country: "Qatar",
    airports: [
      { code: "DOH", name: "Hamad International Airport", city: "Doha", isMainHub: true }
    ]
  },
  "KUWAIT": {
    country: "Kuwait",
    airports: [
      { code: "KWI", name: "Kuwait International Airport", city: "Kuwait City", isMainHub: true }
    ]
  },
  "BAHRAIN": {
    country: "Bahrain",
    airports: [
      { code: "BAH", name: "Bahrain International Airport", city: "Manama", isMainHub: true }
    ]
  },
  "OMAN": {
    country: "Oman",
    airports: [
      { code: "MCT", name: "Muscat International Airport", city: "Muscat", isMainHub: true },
      { code: "SLL", name: "Salalah Airport", city: "Salalah", isMainHub: false },
      { code: "KHS", name: "Khasab Airport", city: "Khasab", isMainHub: false },
      { code: "DMM", name: "Duqm Jaaluni Airport", city: "Duqm", isMainHub: false },
      { code: "UKH", name: "Khasab Airport", city: "Khasab", isMainHub: false }
    ]
  },
  "EGYPT": {
    country: "Egypt",
    airports: [
      { code: "CAI", name: "Cairo International Airport", city: "Cairo", isMainHub: true },
      { code: "HRG", name: "Hurghada International Airport", city: "Hurghada", isMainHub: true },
      { code: "SSH", name: "Sharm El Sheikh International Airport", city: "Sharm El Sheikh", isMainHub: true },
      { code: "LXR", name: "Luxor International Airport", city: "Luxor", isMainHub: false },
      { code: "ASW", name: "Aswan International Airport", city: "Aswan", isMainHub: false }
    ]
  },
  "MOROCCO": {
    country: "Morocco",
    airports: [
      { code: "CMN", name: "Mohammed V International Airport", city: "Casablanca", isMainHub: true },
      { code: "RAK", name: "Marrakesh Menara Airport", city: "Marrakesh", isMainHub: true },
      { code: "AGA", name: "Agadir – Al Massira Airport", city: "Agadir", isMainHub: false },
      { code: "FEZ", name: "Fès–Saïs Airport", city: "Fès", isMainHub: false },
      { code: "OUD", name: "Oujda Angads Airport", city: "Oujda", isMainHub: false }
    ]
  },
  "NIGERIA": {
    country: "Nigeria",
    airports: [
      { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", isMainHub: true },
      { code: "ABV", name: "Nnamdi Azikiwe International Airport", city: "Abuja", isMainHub: true },
      { code: "KAN", name: "Mallam Aminu Kano International Airport", city: "Kano", isMainHub: false },
      { code: "PHC", name: "Port Harcourt International Airport", city: "Port Harcourt", isMainHub: false },
      { code: "KAD", name: "Kaduna Airport", city: "Kaduna", isMainHub: false }
    ]
  },
  "KENYA": {
    country: "Kenya",
    airports: [
      { code: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", isMainHub: true },
      { code: "MBA", name: "Moi International Airport", city: "Mombasa", isMainHub: true },
      { code: "KIS", name: "Kisumu International Airport", city: "Kisumu", isMainHub: false },
      { code: "EDI", name: "Eldoret International Airport", city: "Eldoret", isMainHub: false },
      { code: "MYD", name: "Malindi Airport", city: "Malindi", isMainHub: false }
    ]
  },
  "GHANA": {
    country: "Ghana",
    airports: [
      { code: "ACC", name: "Kotoka International Airport", city: "Accra", isMainHub: true },
      { code: "KMS", name: "Kumasi International Airport", city: "Kumasi", isMainHub: false },
      { code: "TML", name: "Tamale International Airport", city: "Tamale", isMainHub: false },
      { code: "TKD", name: "Takoradi Airport", city: "Takoradi", isMainHub: false },
      { code: "NYI", name: "Sunyani Airport", city: "Sunyani", isMainHub: false }
    ]
  },
  "ARGENTINA": {
    country: "Argentina",
    airports: [
      { code: "EZE", name: "Ministro Pistarini International Airport", city: "Buenos Aires", isMainHub: true },
      { code: "AEP", name: "Jorge Newbery Airfield", city: "Buenos Aires", isMainHub: true },
      { code: "COR", name: "Ingeniero Aeronáutico Ambrosio L.V. Taravella International Airport", city: "Córdoba", isMainHub: true },
      { code: "MDZ", name: "Governor Francisco Gabrielli International Airport", city: "Mendoza", isMainHub: false },
      { code: "ROS", name: "Rosario – Islas Malvinas International Airport", city: "Rosario", isMainHub: false }
    ]
  },
  "CHILE": {
    country: "Chile",
    airports: [
      { code: "SCL", name: "Comodoro Arturo Merino Benítez International Airport", city: "Santiago", isMainHub: true },
      { code: "ANF", name: "Cerro Moreno International Airport", city: "Antofagasta", isMainHub: false },
      { code: "PUQ", name: "Presidente Carlos Ibáñez del Campo International Airport", city: "Punta Arenas", isMainHub: false },
      { code: "PMC", name: "El Tepual Airport", city: "Puerto Montt", isMainHub: false },
      { code: "CCP", name: "Carriel Sur International Airport", city: "Concepción", isMainHub: false }
    ]
  },
  "COLOMBIA": {
    country: "Colombia",
    airports: [
      { code: "BOG", name: "El Dorado International Airport", city: "Bogotá", isMainHub: true },
      { code: "MDE", name: "José María Córdova International Airport", city: "Medellín", isMainHub: true },
      { code: "CLO", name: "Alfonso Bonilla Aragón International Airport", city: "Cali", isMainHub: false },
      { code: "CTG", name: "Rafael Núñez International Airport", city: "Cartagena", isMainHub: false },
      { code: "SMR", name: "Simón Bolívar International Airport", city: "Santa Marta", isMainHub: false }
    ]
  },
  "PERU": {
    country: "Peru",
    airports: [
      { code: "LIM", name: "Jorge Chávez International Airport", city: "Lima", isMainHub: true },
      { code: "CUZ", name: "Alejandro Velasco Astete International Airport", city: "Cusco", isMainHub: true },
      { code: "IQT", name: "Coronel FAP Francisco Secada Vignetta International Airport", city: "Iquitos", isMainHub: false },
      { code: "AQP", name: "Rodríguez Ballón International Airport", city: "Arequipa", isMainHub: false },
      { code: "PIU", name: "Capitán FAP Guillermo Concha Iberico International Airport", city: "Piura", isMainHub: false }
    ]
  },
  "VENEZUELA": {
    country: "Venezuela",
    airports: [
      { code: "CCS", name: "Simón Bolívar International Airport", city: "Caracas", isMainHub: true },
      { code: "MAR", name: "La Chinita International Airport", city: "Maracaibo", isMainHub: true },
      { code: "VLN", name: "Arturo Michelena International Airport", city: "Valencia", isMainHub: false },
      { code: "PMV", name: "Del Caribe \"Santiago Mariño\" International Airport", city: "Porlamar", isMainHub: false },
      { code: "BLA", name: "General José Antonio Anzoátegui International Airport", city: "Barcelona", isMainHub: false }
    ]
  }
};

//export default AIRPORTS;
