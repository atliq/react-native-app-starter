"use strict";
/**
 * Application constants and configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.BUN_INSTALL_COMMANDS = exports.PLATFORMS = exports.VALIDATION_PATTERNS = exports.REPOSITORY_URLS = void 0;
exports.REPOSITORY_URLS = {
    TYPESCRIPT: "https://github.com/atliq/react-native-boilerplate-ts.git",
};
exports.VALIDATION_PATTERNS = {
    INVALID_DIRECTORY: /[<>:"\/\\|?*\x00-\x1F]/,
};
exports.PLATFORMS = {
    WINDOWS: "win32",
    UNIX: ["darwin", "linux"],
};
exports.BUN_INSTALL_COMMANDS = {
    WINDOWS: 'powershell -c "irm bun.sh/install.ps1 | iex"',
    UNIX: "curl -fsSL https://bun.sh/install | bash",
};
exports.ERROR_MESSAGES = {
    INVALID_DIRECTORY: `
      Invalid directory name.
      Usage : '@atliq/react-native-starter name_of_app'
      `,
    BUN_INSTALL_FAILED: "Failed to install Bun. Please install it manually from https://bun.sh",
};
//# sourceMappingURL=constants.js.map