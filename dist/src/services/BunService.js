"use strict";
/**
 * Bun installation and management service
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
const os = __importStar(require("os"));
const shell = __importStar(require("shelljs"));
const constants_1 = require("../config/constants");
class BunService {
    /**
     * Checks if Bun is installed
     * @returns True if Bun is installed
     */
    static isInstalled() {
        console.log("Checking if Bun is installed...");
        const bunCheck = shell.exec("bun --version", { silent: true });
        if (bunCheck.code === 0) {
            console.log(`Bun is already installed (version: ${bunCheck.stdout.trim()})`);
            return true;
        }
        return false;
    }
    /**
     * Installs Bun based on the current platform
     * @returns True if installation was successful
     */
    static install() {
        console.log("Bun is not installed. Installing Bun...");
        const platform = os.platform();
        let installResult;
        if (platform === constants_1.PLATFORMS.WINDOWS) {
            console.log("Detected Windows. Installing Bun using PowerShell...");
            installResult = shell.exec(constants_1.BUN_INSTALL_COMMANDS.WINDOWS, {
                silent: false,
            });
        }
        else {
            console.log("Detected Unix-like system. Installing Bun using curl and bash...");
            installResult = shell.exec(constants_1.BUN_INSTALL_COMMANDS.UNIX, { silent: false });
        }
        if (installResult.code === 0) {
            console.log("Bun installed successfully!");
            return this._addToPath(platform) && this._verifyInstallation(platform);
        }
        else {
            console.error(`${constants_1.ERROR_MESSAGES.BUN_INSTALL_FAILED} on ${platform}`);
            if (platform === constants_1.PLATFORMS.WINDOWS) {
                console.error("For Windows, you can also try: npm install -g bun");
            }
            return false;
        }
    }
    /**
     * Adds Bun to the current session's PATH
     * @param platform - Current platform
     * @returns True if successfully added to PATH
     * @private
     */
    static _addToPath(platform) {
        try {
            const homeDir = os.homedir();
            let bunPath;
            if (platform === constants_1.PLATFORMS.WINDOWS) {
                bunPath = `${homeDir}\\.bun\\bin`;
                process.env.PATH = `${bunPath};${process.env.PATH}`;
            }
            else {
                bunPath = `${homeDir}/.bun/bin`;
                process.env.PATH = `${bunPath}:${process.env.PATH}`;
            }
            return true;
        }
        catch (error) {
            console.error("Error adding Bun to PATH:", error.message);
            return false;
        }
    }
    /**
     * Verifies that Bun installation was successful
     * @param platform - Current platform
     * @returns True if verification successful
     * @private
     */
    static _verifyInstallation(platform) {
        const verifyResult = shell.exec("bun --version", { silent: true });
        if (verifyResult.code === 0) {
            console.log(`Bun verification successful (version: ${verifyResult.stdout.trim()})`);
            return true;
        }
        else {
            console.warn("Bun was installed but verification failed. You may need to restart your terminal or reload your shell profile.");
            if (platform === constants_1.PLATFORMS.WINDOWS) {
                console.warn("On Windows, you might need to restart your command prompt or PowerShell session.");
            }
            return false;
        }
    }
    /**
     * Ensures Bun is available for use
     * @returns True if Bun is available
     */
    static ensureAvailable() {
        if (this.isInstalled()) {
            return true;
        }
        const installed = this.install();
        if (!installed) {
            console.warn("Continuing without Bun. Some features may not work as expected.");
        }
        return installed;
    }
}
exports.default = BunService;
//# sourceMappingURL=BunService.js.map