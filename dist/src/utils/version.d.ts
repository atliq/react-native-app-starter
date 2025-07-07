/**
 * Version comparison utilities
 */
/**
 * Compares semantic versions
 * @param version1 - First version to compare
 * @param version2 - Second version to compare
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
export declare const compareVersions: (version1: string, version2: string) => number;
/**
 * Checks if a version is static (doesn't have ^, ~, etc.)
 * @param version - Version string to check
 * @returns True if static version
 */
export declare const isStaticVersion: (version: string) => boolean;
//# sourceMappingURL=version.d.ts.map