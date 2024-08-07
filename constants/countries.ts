// countries.ts

interface AIRPORT_PROPS {
  code: string[3];
  name: string;
  isMain: boolean;
  //country: string;
}

interface COUNTRIES {
  [country: string] : string[]
}

export const countryMap: COUNTRIES = {
  "USA": ["ATL", "LAX", "ORD", "DFW", "JFK"],
  "CANADA": ["YYZ", "YVR", "YYC", "YUL", "YOW"],
  "UK": ["LHR", "LGW", "MAN", "STN", "EDI"],
  "GERMANY": ["FRA", "MUC", "TXL", "DUS", "HAM"],
  "FRANCE": ["CDG", "ORY", "NCE", "LYS", "MRS"],
  "CHINA": ["PEK", "PVG", "CAN", "HGH", "SZX"],
  "JAPAN": ["NRT", "HND", "KIX", "NGO", "FUK"],
  "INDIA": ["DEL", "BOM", "BLR", "MAA", "HYD"],
  "AUSTRALIA": ["SYD", "MEL", "BNE", "PER", "ADL"],
  "BRAZIL": ["GRU", "GIG", "BSB", "CGH", "SDU"],
  "SOUTH AFRICA": ["JNB", "CPT", "DUR", "PLZ", "ELS"],
  "RUSSIA": ["SVO", "DME", "LED", "VKO", "KUF"],
  "MEXICO": ["MEX", "CUN", "GDL", "MTY", "TIJ"],
  "ITALY": ["FCO", "MXP", "VCE", "NAP", "BLQ"],
  "SPAIN": ["AGP", "LPA","MAD", "BCN"],
  "UAE": ["DXB", "AUH", "SHJ", "DWC", "RKT"],
  "TURKEY": ["IST", "SAW", "AYT", "ESB", "ADB"],
  "NETHERLANDS": ["AMS", "RTM", "EIN", "GRQ", "MST"],
  "SWITZERLAND": ["ZRH", "GVA", "BSL", "BRN", "LUG"],
  "SINGAPORE": ["SIN"],
  "HONG KONG": ["HKG"],
  "SOUTH KOREA": ["ICN", "GMP", "PUS", "CJU", "TAE"],
  "NEW ZEALAND": ["AKL", "WLG", "CHC", "ZQN", "DUD"],
  "INDONESIA": ["CGK", "DPS", "SUB", "MES", "JOG"],
  "MALAYSIA": ["KUL", "LGK", "PEN", "BKI", "KCH"],
  "THAILAND": ["BKK", "DMK", "HKT", "CNX", "CEI"],
  "VIETNAM": ["SGN", "HAN", "DAD", "CXR", "HPH"],
  "PHILIPPINES": ["MNL", "CEB", "DVO", "CRK", "ILO"],
  "PAKISTAN": ["KHI", "LHE", "ISB", "PEW", "MUX"],
  "BANGLADESH": ["DAC", "CGP", "ZYL", "CXB", "JSR"],
  "SRI LANKA": ["CMB", "HRI", "BTC", "JAF", "KCT"],
  "SAUDI ARABIA": ["JED", "RUH", "DMM", "MED", "TIF"],
  "ISRAEL": ["TLV", "SDV", "ETH", "RPN", "VDA"],
  "QATAR": ["DOH"],
  "KUWAIT": ["KWI"],
  "BAHRAIN": ["BAH"],
  "OMAN": ["MCT", "SLL", "KHS", "DMM", "UKH"],
  "EGYPT": ["CAI", "HRG", "SSH", "LXR", "ASW"],
  "MOROCCO": ["CMN", "RAK", "AGA", "FEZ", "OUD"],
  "NIGERIA": ["LOS", "ABV", "KAN", "PHC", "KAD"],
  "KENYA": ["NBO", "MBA", "KIS", "EDI", "MYD"],
  "GHANA": ["ACC", "KMS", "TML", "TKD", "NYI"],
  "ARGENTINA": ["EZE", "AEP", "COR", "MDZ", "ROS"],
  "CHILE": ["SCL", "ANF", "PUQ", "PMC", "CCP"],
  "COLOMBIA": ["BOG", "MDE", "CLO", "CTG", "SMR"],
  "PERU": ["LIM", "CUZ", "IQT", "AQP", "PIU"],
  "VENEZUELA": ["CCS", "MAR", "VLN", "PMV", "BLA"],
};


export default countryMap
