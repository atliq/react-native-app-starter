"use strict";
/**
 * Validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNameGenerator = exports.isValidDirectoryName = void 0;
const constants_1 = require("../config/constants");
/**
 * Validates if the directory name is valid
 * @param directoryName - The directory name to validate
 * @returns True if valid, false otherwise
 */
const isValidDirectoryName = (directoryName) => {
    return !directoryName.match(constants_1.VALIDATION_PATTERNS.INVALID_DIRECTORY);
};
exports.isValidDirectoryName = isValidDirectoryName;
/**
 * Generates a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
const randomNameGenerator = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        const random = Math.floor(Math.random() * 27);
        result += String.fromCharCode(97 + random);
    }
    return result;
};
exports.randomNameGenerator = randomNameGenerator;
//# sourceMappingURL=validation.js.map