import { cleanIBAN, 
         checkLength,
         checkCheckDigits,
         checkCountryCode,
         checkStartOfIBAN,
         checkInvalidChars } from '../ibanValidator';

import { IBANValidationError } from '../types';

describe('when coarse formatting', () => {

    describe('non-valid characters', () => {

        it('should clean out spaces', () => {
            const ibanUnderTest = "DE12 3456 7890 1234 5678 90"
            const cleanedIban = "DE12345678901234567890"
            const result = cleanIBAN(ibanUnderTest)
            expect(result).toEqual(cleanedIban)
        })

        it('should clean out tabs', () => {
            const ibanUnderTest = "DE12\t3456\t7890\t1234\t5678\t90"
            const cleanedIban = "DE12345678901234567890"
            const result = cleanIBAN(ibanUnderTest)
            expect(result).toEqual(cleanedIban)
        });

        it('should clean out dashes', () => {
            const ibanUnderTest = "DE12-3456-7890-1234-5678-90"
            const cleanedIban = "DE12345678901234567890"
            const result = cleanIBAN(ibanUnderTest)
            expect(result).toEqual(cleanedIban)
        })

        it('should reject invalid charactesr', () => {
            const ibanUnderTest = "DE*123,456789🐶01234567890"
            const result = checkInvalidChars(ibanUnderTest)
            expect(result).toBe(false)
        })

        it("should pass valid characters", () => {
            const ibanUnderTest = "DE12345678901234567890"
            const result = checkInvalidChars(ibanUnderTest)
            expect(result).toBe(true)
        })
    })

    describe('IBAN start characters', () => {
        it('should reject an IBAN that starts with numbers', () => {
            const ibanUnderTest = "12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should reject an IBAN that starts with a single lowercase letter', () => {
            const ibanUnderTest = "a12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should reject an IBAN that starts with a single uppercase letter', () => {
            const ibanUnderTest = "A12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should reject an IBAN that starts with a non-alpha characters', () => {
            const ibanUnderTest = "🐶E12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should reject an IBAN that starts with multiple non-alpha characters', () => {
            const ibanUnderTest = "🐶🐔12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should pass an IBAN that starts with two lowercase alpha characters', () => {
            const ibanUnderTest = "ab12345678901234567890"
            const result = checkStartOfIBAN(ibanUnderTest)
            expect(result).toBe(true)
        })

        it('should reject an IBAN with alpha characters in the checkdigits', () => {
            const ibanUnderTest = "ABCD345678901234567890"
            const result = checkCheckDigits(ibanUnderTest)
            expect(result).toBe(false)
        })

        it('should pass an IBAN with numeric characters in the checkdigits', () => {
            const ibanUnderTest = "AB11345678901234567890"
            const result = checkCheckDigits(ibanUnderTest)
            expect(result).toBe(true)
        })

        it('should reject an IBAN with an invalid country code', () => {
            const ibanUnderTest = "XY11345678901234567890"
            const result = checkCountryCode(ibanUnderTest)
            expect(result).toBe(false)
        })
        
        it('should pass an IBAN with a valid country code', () => {
            const ibanUnderTest = "DE11345678901234567890"
            const result = checkCountryCode(ibanUnderTest)
            expect(result).toBe(true)
        })

        it('should pass an IBAN with a valid country code in lowercase', () => {
            const ibanUnderTest = "de11345678901234567890"
            const result = checkCountryCode(ibanUnderTest)
            expect(result).toBe(true)
        })
    })

    describe ('IBAN length', () => {

        it('should reject an IBAN has more than 34 characters', () => {
            const ibanUnderTest = "DE123456789012345678901234567890";
            const result = checkLength(ibanUnderTest);
            expect(result).toBeFalsy
        });

        it('should reject an IBAN that is too long for the country length', () => {
            const testCases = [
                // DE: 22, BE: 16, MT: 31
                { country: 'DE', iban: "DE345678901234567890123" }, // 23 chars
                { country: 'BE', iban: "BE345678901234567" }, // 17 chars
                { country: 'MT', iban: "MT345678901234567890123456789012" }, // 32 chars
            ];
      
            testCases.forEach(({ country: _, iban }) => {
                const result = checkLength(iban);
                expect(result).toBeFalsy;
            });
        });

        it('should pass an IBAN that is the correct length for the country', () => {
            const testCases = [
                // DE: 22, BE: 16, MT: 31
                { country: 'DE', iban: "DE34567890123456789012" }, // 22 chars
                { country: 'BE', iban: "BE34567890123456" }, // 16 chars
                { country: 'MT', iban: "MT34567890123456789012345678901" }, // 31 chars
            ];
      
            testCases.forEach(({ country: _, iban }) => {
                const result = checkLength(iban);
                expect(result).toBe(true);
            });
        
        });

        it('should return invalid country code when checking length with an invalid country', () => {
            const ibanUnderTest = "XX34567890"; // should be 32
            const result = checkLength(ibanUnderTest)
            expect(result).toBeFalsy;
        });
        
    })

})