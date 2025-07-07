/**
 * Version comparison utilities
 */

/**
 * Compares semantic versions
 * @param version1 - First version to compare
 * @param version2 - Second version to compare
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
export const compareVersions = (version1: string, version2: string): number => {
  // Remove any non-numeric prefixes (like ^, ~, etc.)
  const clean1 = version1.replace(/^[^0-9]*/, "");
  const clean2 = version2.replace(/^[^0-9]*/, "");

  // Handle invalid versions
  if (!clean1 || !clean2) {
    return 0;
  }

  const parts1 = clean1.split(".").map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });
  const parts2 = clean2.split(".").map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
};

/**
 * Checks if a version is static (doesn't have ^, ~, etc.)
 * @param version - Version string to check
 * @returns True if static version
 */
export const isStaticVersion = (version: string): boolean => {
  return (
    /^[0-9]/.test(version) &&
    !version.includes("^") &&
    !version.includes("~") &&
    !version.includes("*")
  );
};

