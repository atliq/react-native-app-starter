"use strict";
/**
 * File system utilities
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFiles = exports.safeRemove = exports.writeJsonFile = exports.readJsonFile = void 0;
const fs_1 = require("fs");
const shell = __importStar(require("shelljs"));
/**
 * Safely reads and parses a JSON file
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or empty object if file doesn't exist/invalid
 */
const readJsonFile = (filePath) => {
    try {
        if (!(0, fs_1.existsSync)(filePath)) {
            return {};
        }
        const content = (0, fs_1.readFileSync)(filePath, "utf8");
        return JSON.parse(content);
    }
    catch (error) {
        console.warn(`Could not read/parse JSON file ${filePath}:`, error.message);
        return {};
    }
};
exports.readJsonFile = readJsonFile;
/**
 * Safely writes a JSON object to a file
 * @param filePath - Path to write the file
 * @param data - Data to write
 * @param spaces - Number of spaces for indentation (default: 2)
 */
const writeJsonFile = (filePath, data, spaces = 2) => {
    try {
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(data, null, spaces));
    }
    catch (error) {
        console.error(`Error writing JSON file ${filePath}:`, error.message);
        throw error;
    }
};
exports.writeJsonFile = writeJsonFile;
/**
 * Safely removes a directory or file with retry logic for Windows compatibility
 * @param path - Path to remove
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Delay between retries in milliseconds (default: 100)
 */
const safeRemove = (path, maxRetries = 3, retryDelay = 100) => {
    if (!(0, fs_1.existsSync)(path)) {
        return;
    }
    let attempt = 0;
    const attemptRemoval = () => {
        try {
            (0, fs_1.rmSync)(path, {
                recursive: true,
                force: true,
                maxRetries: 3,
                retryDelay: 100,
            });
            console.log(`Successfully cleaned up temporary directory: ${path}`);
        }
        catch (error) {
            attempt++;
            const errorMessage = error.message;
            // Check if it's a common Windows file handle issue
            const isWindowsHandleError = errorMessage.includes("EBUSY") ||
                errorMessage.includes("EPERM") ||
                errorMessage.includes("ENOTEMPTY");
            if (attempt < maxRetries && isWindowsHandleError) {
                console.warn(`Attempt ${attempt} failed to remove ${path}, retrying in ${retryDelay}ms...`);
                setTimeout(attemptRemoval, retryDelay);
                return;
            }
            // Log the final error if all retries failed
            console.error(`Failed to remove temporary directory ${path} after ${attempt} attempts:`, errorMessage);
            console.warn("You may need to manually delete the temporary directory.");
        }
    };
    attemptRemoval();
};
exports.safeRemove = safeRemove;
/**
 * Copies files from source to destination
 * @param source - Source path
 * @param destination - Destination path
 * @param options - Copy options
 */
const copyFiles = (source, destination, options = { recursive: true }) => {
    try {
        const flags = options.recursive ? "-rf" : "-f";
        shell.cp(flags, source, destination);
    }
    catch (error) {
        console.error(`Error copying from ${source} to ${destination}:`, error.message);
        throw error;
    }
};
exports.copyFiles = copyFiles;
//# sourceMappingURL=fileSystem.js.map