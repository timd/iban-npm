# IBAN Validator

[![npm version](https://img.shields.io/npm/v/iban-validator.svg)](https://www.npmjs.com/package/iban-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, comprehensive TypeScript library for validating International Bank Account Numbers (IBANs) with detailed error reporting.

## Features

- 🔍 Complete IBAN validation according to the official standard
- 🌍 Support for all country-specific IBAN formats
- 🧹 Automatic cleaning of input (spaces, dashes, etc.)
- 🚨 Detailed error reporting
- 💯 Thoroughly tested with real IBAN examples
- 🪶 Zero dependencies
- 📦 TypeScript support with included type definitions

## Installation

```bash
npm install iban-validator
```

Or using yarn:

```bash
yarn add iban-validator
```

## Usage

### Basic Validation

The simplest way to validate an IBAN is using the `isValid` function:

```typescript
import { isValid } from 'iban-validator';

// Returns true for valid IBANs
isValid('NL11ABNA0481433284'); // true
isValid('NL11 ABNA 0481 4332 84'); // true (spaces are automatically cleaned)

// Returns false for invalid IBANs
isValid('NL33ABNA0481433284'); // false (invalid checksum)
isValid('XX11ABNA0481433284'); // false (invalid country code)
```

### Detailed Validation

For more detailed error information, use the `isValidWithResult` function:

```typescript
import { isValidWithResult, IBANValidationError } from 'iban-validator';

const result = isValidWithResult('NL11ABNA048143328*');

if (result.success) {
  // IBAN is valid
  console.log('IBAN is valid');
} else {
  // IBAN is invalid, check the specific error
  switch (result.error) {
    case IBANValidationError.InvalidCharacters:
      console.log('IBAN contains invalid characters');
      break;
    case IBANValidationError.InvalidCountryCode:
      console.log('IBAN has an invalid country code');
      break;
    case IBANValidationError.InvalidLength:
      console.log('IBAN has an invalid length for the country');
      break;
    case IBANValidationError.InvalidChecksum:
      console.log('IBAN has an invalid checksum');
      break;
    case IBANValidationError.UnknownError:
      console.log('Unknown error occurred during validation');
      break;
  }
}
```

## Supported Countries

This library supports IBAN validation for all countries that use the IBAN system, including:

- All EU countries
- Non-EU European countries (e.g., Switzerland, Norway, UK)
- Middle Eastern countries (e.g., Saudi Arabia, UAE)
- North African countries (e.g., Tunisia)

Each country has specific length requirements and format validation.

## How it Works

IBAN validation consists of several steps:

1. Check for invalid characters (only alphanumeric characters are allowed)
2. Validate the country code (first two letters)
3. Check the length according to the country-specific requirements
4. Verify the check digits by:
   - Moving the first four characters to the end
   - Converting letters to numbers (A=10, B=11, etc.)
   - Calculating modulo 97 to ensure the remainder is 1

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Test IBANs provided by [IBAN BIC](https://www.iban-bic.com/sample_accounts.html)
- IBAN structure specifications from the [SWIFT IBAN Registry](https://www.swift.com/standards/data-standards/iban)