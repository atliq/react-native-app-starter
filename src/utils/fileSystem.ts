/**
 * File system utilities
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import * as shell from "shelljs";
import { PackageJson } from "../types";

/**
 * Safely reads and parses a JSON file
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or empty object if file doesn't exist/invalid
 */
export const readJsonFile = (filePath: string): PackageJson => {
  try {
    if (!existsSync(filePath)) {
      return {};
    }
    const content = readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(
      `Could not read/parse JSON file ${filePath}:`,
      (error as Error).message
    );
    return {};
  }
};

/**
 * Safely writes a JSON object to a file
 * @param filePath - Path to write the file
 * @param data - Data to write
 * @param spaces - Number of spaces for indentation (default: 2)
 */
export const writeJsonFile = (
  filePath: string,
  data: PackageJson,
  spaces: number = 2
): void => {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, spaces));
  } catch (error) {
    console.error(
      `Error writing JSON file ${filePath}:`,
      (error as Error).message
    );
    throw error;
  }
};

/**
 * Safely removes a directory or file with retry logic for Windows compatibility
 * @param path - Path to remove
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Delay between retries in milliseconds (default: 100)
 */
export const safeRemove = (
  path: string,
  maxRetries: number = 3,
  retryDelay: number = 100
): void => {
  if (!existsSync(path)) {
    return;
  }

  let attempt = 0;

  const attemptRemoval = (): void => {
    try {
      rmSync(path, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
      console.log(`Successfully cleaned up temporary directory: ${path}`);
    } catch (error) {
      attempt++;
      const errorMessage = (error as Error).message;

      // Check if it's a common Windows file handle issue
      const isWindowsHandleError =
        errorMessage.includes("EBUSY") ||
        errorMessage.includes("EPERM") ||
        errorMessage.includes("ENOTEMPTY");

      if (attempt < maxRetries && isWindowsHandleError) {
        console.warn(
          `Attempt ${attempt} failed to remove ${path}, retrying in ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        // Log the final error if all retries failed
        console.error(
          `Failed to remove temporary directory ${path} after ${attempt} attempts:`,
          errorMessage
        );
        console.warn("You may need to manually delete the temporary directory.");
        throw error;
      }
    }
  }
};

/**
 * Copies files from source to destination
 * @param source - Source path
 * @param destination - Destination path
 * @param options - Copy options
 */
export const copyFiles = (
  source: string,
  destination: string,
  options: { recursive?: boolean } = { recursive: true }
): void => {
  try {
    const flags = options.recursive ? "-rf" : "-f";
    shell.cp(flags, source, destination);
  } catch (error) {
    console.error(
      `Error copying from ${source} to ${destination}:`,
      (error as Error).message
    );
    throw error;
  }
};

