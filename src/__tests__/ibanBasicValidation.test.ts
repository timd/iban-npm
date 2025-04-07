import { checkLength, validateIBAN } from '../ibanValidator'
import { IBANValidationError } from '../types';

describe('The consolidated process', () => {
  
  it('should return true for a valid IBAN', () => {
    const ibanUnderTest = "NL11ABNA0481433284";
    expect(validateIBAN(ibanUnderTest)).toBe(true);
  });
  
  it('should return invalid checksum for an invalid IBAN', () => {
    const ibanUnderTest = "NL33ABNA0481433284";
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidChecksum);
  });
  
  it('should return invalid countrycode for an invalid IBAN', () => {
    const ibanUnderTest = "XY33ABNA0481433284";
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidCountryCode);
  });
  
  it('should return invalid length where an IBAN is longer than 34 chars', () => {
    const ibanUnderTest = "DE34567890123456789012345678901234567890";
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidLength);
  });

  it('should return invalid length where an IBAN is too short for a country', () => {
    const ibanUnderTest = "DE34567890"; // should be 32
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidLength);
  });
  
  it('should return invalid characters for an invalid IBAN', () => {
    const ibanUnderTest = "NL11ABNA048143328*";
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidCharacters);
  });
  
  it('should return invalid characters for an really invalid IBAN', () => {
    const ibanUnderTest = "NL11ABNA04814332🐶🐷";
    expect(() => {
      validateIBAN(ibanUnderTest);
    }).toThrow(IBANValidationError.InvalidCharacters);
  });
  
  it('should return true for valid IBAN series', () => {
    // Test IBANs taken from https://www.iban-bic.com/sample_accounts.html
    
    const ibans = [
      "AL90208110080000001039531801",
      "BE68844010370034",
      "DK5750510001322617",
      "DE12500105170648489890",
      "EE342200221034126658",
      "FI9814283500171141",
      "FR7630066100410001057380116",
      "GB32ESSE40486562136016",
      "IE92BOFI90001710027952",
      "IT68D0300203280000400162854",
      "LI1008800000020176306",
      "LU761111000872960000",
      "MT98MMEB44093000000009027293051",
      "MC1112739000700011111000H79",
      "NL18ABNA0484869868",
      "NO5015032080119",
      "AT022050302101023600",
      "PL37109024020000000610000434",
      "PT50003506830000000784311",
      "SM86U0322509800000000270100",
      "SE6412000000012170145230",
      "CH3908704016075473007",
      "SK9311110000001057361004",
      "SI56031001001300933",
      "ES1020903200500041045040",
      "CZ4201000000195505030267", 
      "HU29117080012054779400000000"
    ];
    
    ibans.forEach(iban => {
      expect(() => {
        validateIBAN(iban);
      }).toBeTruthy;
    });
  });
});