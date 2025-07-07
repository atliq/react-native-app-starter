/**
 * Application constants and configuration
 */

import {
  RepositoryUrls,
  ValidationPatterns,
  Platforms,
  BunInstallCommands,
  ErrorMessages,
} from "../types";

export const REPOSITORY_URLS: RepositoryUrls = {
  TYPESCRIPT: "https://github.com/atliq/react-native-boilerplate-ts.git",
};

export const VALIDATION_PATTERNS: ValidationPatterns = {
  INVALID_DIRECTORY: /[<>:"\/\\|?*\x00-\x1F]/,
};

export const PLATFORMS: Platforms = {
  WINDOWS: "win32",
  UNIX: ["darwin", "linux"],
};

export const BUN_INSTALL_COMMANDS: BunInstallCommands = {
  WINDOWS: 'powershell -c "irm bun.sh/install.ps1 | iex"',
  UNIX: "curl -fsSL https://bun.sh/install | bash",
};

export const ERROR_MESSAGES: ErrorMessages = {
  INVALID_DIRECTORY: `
      Invalid directory name.
      Usage : '@atliq/react-native-starter name_of_app'
      `,
  BUN_INSTALL_FAILED:
    "Failed to install Bun. Please install it manually from https://bun.sh",
};

