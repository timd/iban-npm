// AdditionalTests.ts
import { 
  validateIBAN, 
  validateIBANWithResult, 
  checkStartOfIBAN, 
  IBANValidationError 
} from '../ibanValidator';

// Mock the entire module
jest.mock('../ibanValidator', () => {
  // Get the actual module first
  const originalModule = jest.requireActual('../ibanValidator');
  
  // Return a modified version
  return {
    ...originalModule,
    // We'll override specific functions in the tests
  };
});

describe('IBAN Validator Additional Tests', () => {
  // Restore original implementation after each test
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Testing validateIBAN error cases', () => {
    it('should throw an error when the IBAN contains invalid characters - line 110', () => {
      const ibanUnderTest = "DE345678901234567890😭😩";
      
      expect(() => {
        validateIBAN(ibanUnderTest);
      }).toThrow(IBANValidationError.InvalidCharacters);
    });

    it('should throw an error when the country code is invalid - line 115', () => {
      const ibanUnderTest = "QQ345678901234567890"; // should be 32
      
      expect(() => {
        validateIBAN(ibanUnderTest);
      }).toThrow(IBANValidationError.InvalidCountryCode);
    });

    it('should throw an error for an invalid length - line 120', () => {
      const ibanUnderTest = "DE123"; // DE is valid but length is wrong
      
      expect(() => {
        validateIBAN(ibanUnderTest);
      }).toThrow(IBANValidationError.InvalidLength);
    });
    
    it('should throw an error for an invalid checksum directly from validateIBAN', () => {
      // This is a valid IBAN format but with incorrect checksum
      const ibanUnderTest = "DE99500105170648489890";
      
      expect(() => {
        validateIBAN(ibanUnderTest);
      }).toThrow(IBANValidationError.InvalidChecksum);
    });
  });

  describe('Testing validateIBANWithResult', () => {
    it('should return success for a valid IBAN', () => {
      const ibanUnderTest = "DE12500105170648489890";
      const result = validateIBANWithResult(ibanUnderTest);
      
      expect(result).toEqual({ success: true, value: true });
    });

    it('should return failure with the specific error for invalid IBAN', () => {
      const ibanUnderTest = "DE99500105170648489890"; // Invalid checksum
      const result = validateIBANWithResult(ibanUnderTest);
      
      expect(result).toEqual({ 
        success: false, 
        error: IBANValidationError.InvalidChecksum 
      });
    });

    // Test for line 290 - Non-Error exception handling
    it('should handle non-Error exceptions and return InvalidCharacters', () => {
      // The key is to properly mock validateIBAN to throw a non-Error object
      
      // Override validateIBAN with a function that throws a string
      jest.spyOn(require('../ibanValidator'), 'validateIBAN')
        .mockImplementation(() => {
          throw "Some non-error exception";
        });
      
      // This should now catch the string exception and return InvalidCharacters
      const result = validateIBANWithResult("ANY_IBAN");
      
      // Verify the result matches what we expect from line 290
      expect(result).toEqual({
        success: false, 
        error: IBANValidationError.InvalidCharacters
      });
    });
  });
});