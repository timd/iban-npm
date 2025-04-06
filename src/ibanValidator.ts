// IBANValidator.ts

// Error types enum
export enum IBANValidationError {
  InvalidChecksum = "Invalid checksum",
  InvalidCountryCode = "Invalid country code",
  InvalidLength = "Invalid length",
  InvalidCharacters = "Invalid characters",
  UnknownError = "Unknown error"
}

// Result type for validation
export type ResultType<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

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
const letters: Record<string, number> = {
  "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17,
  "I": 18, "J": 19, "K": 20, "L": 21, "M": 22, "N": 23, "O": 24, "P": 25,
  "Q": 26, "R": 27, "S": 28, "T": 29, "U": 30, "V": 31, "W": 32, "X": 33,
  "Y": 34, "Z": 35
};

/**
 * IBAN Validator main function
 * @param iban The IBAN to validate
 * @returns True if valid, throws error otherwise
 */
export function validateIBAN(iban: string): boolean {
  // Check invalid chars
  if (!checkInvalidChars(iban)) {
    throw new Error(IBANValidationError.InvalidCharacters);
  }
  
  // Check country code
  if (!checkCountryCode(iban)) {
    throw new Error(IBANValidationError.InvalidCountryCode);
  }

  // Check length
  if(!checkLength(iban)) {
    throw new Error(IBANValidationError.InvalidLength);
  }
              
  // Clean IBAN
  const cleanedIban = cleanIBAN(iban);
  
  // Isolate existing checksum
  const startChars = cleanedIban.substring(0, 4);
  const existingChecksum = startChars.substring(2, 4);
  
  // Rearrange
  const rearrangedIban = rearrange(cleanedIban);
  
  // Replace alpha chars
  const nonAlphaIban = replaceAlphaChars(rearrangedIban);
  
  // Calculate checksum
  const calculatedChecksum = calculateChecksum(nonAlphaIban);
  
  // Test that checksums match
  if (calculatedChecksum !== existingChecksum) {
    throw new Error(IBANValidationError.InvalidChecksum);
  }
  
  return true;
}

/**
 * Checks that the IBAN contains only alphanumeric characters
 */
export function checkInvalidChars(iban: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(iban);
}

/**
 * Cleans an IBAN by removing non-alphanumeric characters
 */
export function cleanIBAN(iban: string): string {
  return iban.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Checks that the IBAN starts with two uppercase letters
 */
export function checkStartOfIBAN(iban: string): boolean {
  const startChars = iban.substring(0, 2).toUpperCase();
  const alphabeticRegex = /^[A-Z]{2}$/;
  
  return alphabeticRegex.test(startChars);
}

/**
 * Checks that the check digits (positions 3-4) contain at least one digit
 */
export function checkCheckDigits(iban: string): boolean {
  const checkDigits = iban.substring(2, 4);
  const digitRegex = /[0-9]/;
  
  return digitRegex.test(checkDigits);
}

/**
 * Checks that the country code is valid
 */
export function checkCountryCode(iban: string): boolean {
  const countryCode = iban.substring(0, 2).toUpperCase();
  return countries[countryCode] !== undefined;
}

/**
 * Checks that the length is valid for the country
 */
export function checkLength(iban: string): boolean {
  if (iban.length > 34) {
    throw new Error(IBANValidationError.InvalidLength);
  }
  
  // Get country code
  const countryCode = iban.substring(0, 2).toUpperCase();
  
  if (countries[countryCode]) {
    if (iban.length === countries[countryCode].ibanLength) {
      return true;
    } else {
      throw new Error(IBANValidationError.InvalidLength);
    }
  } else {
    throw new Error(IBANValidationError.InvalidCountryCode);
  }
}

/**
 * Rearranges the IBAN for checksum calculation
 */
export function rearrange(iban: string): string {
  // Get first 4 chars
  const firstFourChars = iban.substring(0, 4);
  
  // Get first two chars (country code)
  const firstTwoChars = firstFourChars.substring(0, 2);
  
  // Get remaining chars
  const remainingChars = iban.substring(4);
  
  // Return rearranged string with "00" as placeholder for check digits
  return remainingChars + firstTwoChars + "00";
}

/**
 * Replaces alpha chars with their numeric equivalents
 */
export function replaceAlphaChars(iban: string): string {
  let updatedIban = iban.toUpperCase();
  
  // Replace each letter with its corresponding number
  for (const [letter, value] of Object.entries(letters)) {
    // Create a regex that's case insensitive to find all instances of the letter
    const regex = new RegExp(letter, 'g');
    updatedIban = updatedIban.replace(regex, value.toString());
  }
  
  return updatedIban;
}

/**
 * Calculates the checksum for the IBAN
 */
export function calculateChecksum(iban: string): string {
  // JavaScript can't handle the large integers in IBANs directly
  // We need to calculate modulo 97 using a different approach
  
  // Use the property that (a * 10 + b) mod 97 = ((a mod 97) * 10 + b) mod 97
  let remainder = 0;
  for (let i = 0; i < iban.length; i++) {
    remainder = (remainder * 10 + parseInt(iban[i], 10)) % 97;
  }
  
  const checksumInt = 98 - remainder;
  
  // Ensure the checksum is always 2 digits
  return checksumInt < 10 ? `0${checksumInt}` : `${checksumInt}`;
}

/**
 * Validates an IBAN and returns a result object
 */
export function validateIBANWithResult(iban: string): ResultType<boolean, IBANValidationError> {
  try {
    validateIBAN(iban);
    return { success: true, value: true };
  } catch (error: any) {
    if (error instanceof Error) {
      const message = error.message as IBANValidationError;
      return { success: false, error: message };
    }
    return { success: false, error: IBANValidationError.UnknownError };
  }
}