/**
 * Validation utilities
 */

import { VALIDATION_PATTERNS } from "../config/constants";

/**
 * Validates if the directory name is valid
 * @param directoryName - The directory name to validate
 * @returns True if valid, false otherwise
 */
export const isValidDirectoryName = (directoryName: string): boolean => {
  return !directoryName.match(VALIDATION_PATTERNS.INVALID_DIRECTORY);
};

/**
 * Generates a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
export const randomNameGenerator = (length: number): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * 27);
    result += String.fromCharCode(97 + random);
  }
  return result;
};

