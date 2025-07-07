/**
 * File system utilities
 */
import { PackageJson } from "../types";
/**
 * Safely reads and parses a JSON file
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or empty object if file doesn't exist/invalid
 */
export declare const readJsonFile: (filePath: string) => PackageJson;
/**
 * Safely writes a JSON object to a file
 * @param filePath - Path to write the file
 * @param data - Data to write
 * @param spaces - Number of spaces for indentation (default: 2)
 */
export declare const writeJsonFile: (filePath: string, data: PackageJson, spaces?: number) => void;
/**
 * Safely removes a directory or file with retry logic for Windows compatibility
 * @param path - Path to remove
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Delay between retries in milliseconds (default: 100)
 */
export declare const safeRemove: (path: string, maxRetries?: number, retryDelay?: number) => void;
/**
 * Copies files from source to destination
 * @param source - Source path
 * @param destination - Destination path
 * @param options - Copy options
 */
export declare const copyFiles: (source: string, destination: string, options?: {
    recursive?: boolean;
}) => void;
//# sourceMappingURL=fileSystem.d.ts.map