// IBANChecksumTests.ts

import { rearrange, replaceAlphaChars, calculateChecksum } from '../ibanValidator';

describe('IBAN Checksum Tests', () => {
  
  describe('When preparing to calculate the checksum', () => {
    
    it('should rearrange the IBAN ready for checking', () => {
      const ibanUnderTest = "DE1234567890123456789012";
      const rearrangedIban = "34567890123456789012DE00";
      expect(rearrange(ibanUnderTest)).toEqual(rearrangedIban);
    });
    
    it('should replace letters with values', () => {
      const ibanUnderTest1 = "DE34567890123456789012345";
      const rearrangedIban1 = "131434567890123456789012345";
      expect(replaceAlphaChars(ibanUnderTest1)).toEqual(rearrangedIban1);
      
      const ibanUnderTest2 = "NL11ABNA0481433284";
      const rearrangedIban2 = "232111101123100481433284";
      expect(replaceAlphaChars(ibanUnderTest2)).toEqual(rearrangedIban2);
    });
    
  });
  
  describe('When calculating the checksum', () => {
    
    it('should calculate the checksum correctly', () => {
      // NL14ABNA0226614812
      const ibanUnderTest1 = "101123100226614812232100";
      const checksum1 = calculateChecksum(ibanUnderTest1);
      expect(checksum1).toEqual("14");
      
      // NL11ABNA0481433284
      const ibanUnderTest2 = "101123100481433284232100";
      const checksum2 = calculateChecksum(ibanUnderTest2);
      expect(checksum2).toEqual("11");
    });
    
  });
  
});