// IBANValidator.ts

import { IBANValidationError,
         countries,
         letters,
         ResultType } from "./types";
         
/**
* IBAN Validator - basic function
* @param iban The IBAN to validate
* @returns True if valid, false if invalid
*/

export function isValid(iban: string): boolean {

  // Check invalid chars
  if (!checkInvalidChars(iban).success) {
    return false;
  }

  // Check country code
  if (!checkCountryCode(iban).success) {
    return false;
  }

  // Check length
  if(!checkLength(iban).success) {
    return false;
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
    return false;
  }

  return true;
}
        
/**
 * IBAN Validator - detailed error types
 * @param iban The IBAN to validate
 * @returns A ResultType object containing:
 *   - success: true if validation passed, false otherwise
 *   - value: true if validation passed, false if validation failed
 *   - error: The specific IBANValidationError if validation failed (only present when success is false)
 */
export function isValidWithResult(iban: string): ResultType<IBANValidationError> {

  // Check invalid chars
  const checkInvalidCharsResult = checkInvalidChars(iban);
  if (checkInvalidCharsResult.success != true) {
    return checkInvalidCharsResult;
  } 
  
  // Check country code
  const checkCountryCodeResult = checkCountryCode(iban);
  if (checkCountryCodeResult.success != true) {
    return checkCountryCodeResult;
  } 

  // Check length
  const checkLengthResult = checkLength(iban);
  if (checkLengthResult.success != true) {
    return checkLengthResult;
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
    return { success: false, error: IBANValidationError.InvalidChecksum };
  }

  return { success: true };

}

/** UTILITY FUNCTIONS **/

/**
 * Checks that the IBAN contains only alphanumeric characters
 */
export function checkInvalidChars(iban: string): ResultType<IBANValidationError> {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  
  if (alphanumericRegex.test(iban)) {
    return { success: true };
  }
  
  return { success: false, error: IBANValidationError.InvalidCharacters };
  
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
export function checkStartOfIBAN(iban: string): ResultType<IBANValidationError> {
  const startChars = iban.substring(0, 2).toUpperCase();
  const alphabeticRegex = /^[A-Z]{2}$/;
  
  if (alphabeticRegex.test(startChars)) {
    return { success: true };
  };

  return { success: false, error: IBANValidationError.InvalidCountryCode };

}

/**
 * Checks that the check digits (positions 3-4) contain at least one digit
 */
export function checkCheckDigits(iban: string): ResultType<IBANValidationError> {
  const checkDigits = iban.substring(2, 4);
  const digitRegex = /[0-9]/;
  
  if (digitRegex.test(checkDigits)) {
    return { success: true };
  };

  return { success: false, error: IBANValidationError.InvalidChecksum };

}

/**
 * Checks that the country code is valid
 */
export function checkCountryCode(iban: string): ResultType<IBANValidationError> {
  const countryCode = iban.substring(0, 2).toUpperCase();
  if (countries[countryCode] !== undefined) {
    return { success: true };
  };

  return { success: false, error: IBANValidationError.InvalidCountryCode };

}

/**
 * Checks that the length is valid for the country
 */
export function checkLength(iban: string): ResultType<IBANValidationError> {
  if (iban.length > 34) {
    return { success: false, error: IBANValidationError.InvalidLength };
  }
  
  // Get country code
  const countryCode = iban.substring(0, 2).toUpperCase();
  
  if (countries[countryCode]) {
    if (iban.length === countries[countryCode].ibanLength) {
      return { success: true };;
    } else {
      return { success: false, error: IBANValidationError.InvalidLength };
    }
  } else {
    return { success: false, error: IBANValidationError.UnknownError };
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
