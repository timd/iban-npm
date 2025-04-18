// Error types enum
export enum IBANValidationError {
    InvalidChecksum = "Invalid checksum",
    InvalidCountryCode = "Invalid country code",
    InvalidLength = "Invalid length",
    InvalidCharacters = "Invalid characters",
    UnknownError = "Unknown error"
}

export type ResultType<IBANValidationError> =
| { success: true; error?: never }
| { success: false; error: IBANValidationError };
  
  // Country codes with their IBAN lengths
  export interface CountryData {
    name: string;
    ibanLength: number;
  }
  
  export const countries: Record<string, CountryData> = {
    "AL": { name: "Albania", ibanLength: 28 },
    "AD": { name: "Andorra", ibanLength: 24 },
    "AT": { name: "Austria", ibanLength: 20 },
    "AZ": { name: "Azerbaijan", ibanLength: 28 },
    "BH": { name: "Bahrain", ibanLength: 22 },
    "BY": { name: "Belarus", ibanLength: 28 },
    "BE": { name: "Belgium", ibanLength: 16 },
    "BA": { name: "Bosnia and Herzegovina", ibanLength: 20 },
    "BR": { name: "Brazil", ibanLength: 29 },
    "BG": { name: "Bulgaria", ibanLength: 22 },
    "CR": { name: "Costa Rica", ibanLength: 22 },
    "HR": { name: "Croatia", ibanLength: 21 },
    "CY": { name: "Cyprus", ibanLength: 28 },
    "CZ": { name: "Czech Republic", ibanLength: 24 },
    "DK": { name: "Denmark", ibanLength: 18 },
    "DO": { name: "Dominican Republic", ibanLength: 28 },
    "TL": { name: "East Timor", ibanLength: 23 },
    "EE": { name: "Estonia", ibanLength: 20 },
    "FO": { name: "Faroe Islands", ibanLength: 18 },
    "FI": { name: "Finland", ibanLength: 18 },
    "FR": { name: "France", ibanLength: 27 },
    "GE": { name: "Georgia", ibanLength: 22 },
    "DE": { name: "Germany", ibanLength: 22 },
    "GI": { name: "Gibraltar", ibanLength: 23 },
    "GR": { name: "Greece", ibanLength: 27 },
    "GL": { name: "Greenland", ibanLength: 18 },
    "GT": { name: "Guatemala", ibanLength: 28 },
    "HU": { name: "Hungary", ibanLength: 28 },
    "IS": { name: "Iceland", ibanLength: 26 },
    "IE": { name: "Ireland", ibanLength: 22 },
    "IL": { name: "Israel", ibanLength: 23 },
    "IT": { name: "Italy", ibanLength: 27 },
    "JO": { name: "Jordan", ibanLength: 30 },
    "KZ": { name: "Kazakhstan", ibanLength: 20 },
    "XK": { name: "Kosovo", ibanLength: 20 },
    "KW": { name: "Kuwait", ibanLength: 30 },
    "LV": { name: "Latvia", ibanLength: 21 },
    "LB": { name: "Lebanon", ibanLength: 28 },
    "LI": { name: "Liechtenstein", ibanLength: 21 },
    "LT": { name: "Lithuania", ibanLength: 20 },
    "LU": { name: "Luxembourg", ibanLength: 20 },
    "MK": { name: "North Macedonia", ibanLength: 19 },
    "MT": { name: "Malta", ibanLength: 31 },
    "MR": { name: "Mauritania", ibanLength: 27 },
    "MU": { name: "Mauritius", ibanLength: 30 },
    "MC": { name: "Monaco", ibanLength: 27 },
    "MD": { name: "Moldova", ibanLength: 24 },
    "ME": { name: "Montenegro", ibanLength: 22 },
    "NL": { name: "Netherlands", ibanLength: 18 },
    "NO": { name: "Norway", ibanLength: 15 },
    "PK": { name: "Pakistan", ibanLength: 24 },
    "PS": { name: "Palestine", ibanLength: 29 },
    "PL": { name: "Poland", ibanLength: 28 },
    "PT": { name: "Portugal", ibanLength: 25 },
    "QA": { name: "Qatar", ibanLength: 29 },
    "RO": { name: "Romania", ibanLength: 24 },
    "SM": { name: "San Marino", ibanLength: 27 },
    "SA": { name: "Saudi Arabia", ibanLength: 24 },
    "RS": { name: "Serbia", ibanLength: 22 },
    "SK": { name: "Slovakia", ibanLength: 24 },
    "SI": { name: "Slovenia", ibanLength: 19 },
    "ES": { name: "Spain", ibanLength: 24 },
    "SE": { name: "Sweden", ibanLength: 24 },
    "CH": { name: "Switzerland", ibanLength: 21 },
    "TN": { name: "Tunisia", ibanLength: 24 },
    "TR": { name: "Turkey", ibanLength: 26 },
    "AE": { name: "United Arab Emirates", ibanLength: 23 },
    "GB": { name: "United Kingdom", ibanLength: 22 },
    "VG": { name: "Virgin Islands, British", ibanLength: 24 }
  };
  
  // Letter to number mapping for IBAN
  export const letters: Record<string, number> = {
    "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17,
    "I": 18, "J": 19, "K": 20, "L": 21, "M": 22, "N": 23, "O": 24, "P": 25,
    "Q": 26, "R": 27, "S": 28, "T": 29, "U": 30, "V": 31, "W": 32, "X": 33,
    "Y": 34, "Z": 35
  };