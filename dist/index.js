"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBANValidationError = exports.isValidWithResult = exports.isValid = void 0;
// Export main validation functions
var ibanValidator_1 = require("./ibanValidator");
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return ibanValidator_1.isValid; } });
Object.defineProperty(exports, "isValidWithResult", { enumerable: true, get: function () { return ibanValidator_1.isValidWithResult; } });
// Export types for consumers
var types_1 = require("./types");
Object.defineProperty(exports, "IBANValidationError", { enumerable: true, get: function () { return types_1.IBANValidationError; } });
