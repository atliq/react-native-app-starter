/**
 * Bun installation and management service
 */

import * as os from "os";
import * as shell from "shelljs";
import {
  PLATFORMS,
  BUN_INSTALL_COMMANDS,
  ERROR_MESSAGES,
} from "../config/constants";

export default class BunService {
  /**
   * Checks if Bun is installed
   * @returns True if Bun is installed
   */
  static isInstalled(): boolean {
    console.log("Checking if Bun is installed...");
    const bunCheck = shell.exec("bun --version", { silent: true });

    if (bunCheck.code === 0) {
      console.log(
        `Bun is already installed (version: ${bunCheck.stdout.trim()})`
      );
      return true;
    }
    return false;
  }

  /**
   * Installs Bun based on the current platform
   * @returns True if installation was successful
   */
  static install(): boolean {
    console.log("Bun is not installed. Installing Bun...");

    const platform = os.platform();
    let installResult: shell.ShellString;

    if (platform === PLATFORMS.WINDOWS) {
      console.log("Detected Windows. Installing Bun using PowerShell...");
      installResult = shell.exec(BUN_INSTALL_COMMANDS.WINDOWS, {
        silent: false,
      });
    } else {
      console.log(
        "Detected Unix-like system. Installing Bun using curl and bash..."
      );
      installResult = shell.exec(BUN_INSTALL_COMMANDS.UNIX, { silent: false });
    }

    if (installResult.code === 0) {
      console.log("Bun installed successfully!");
      return this._addToPath(platform) && this._verifyInstallation(platform);
    } else {
      console.error(`${ERROR_MESSAGES.BUN_INSTALL_FAILED} on ${platform}`);
      if (platform === PLATFORMS.WINDOWS) {
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
  private static _addToPath(platform: string): boolean {
    try {
      const homeDir = os.homedir();
      let bunPath: string;

      if (platform === PLATFORMS.WINDOWS) {
        bunPath = `${homeDir}\\.bun\\bin`;
        process.env.PATH = `${bunPath};${process.env.PATH}`;
      } else {
        bunPath = `${homeDir}/.bun/bin`;
        process.env.PATH = `${bunPath}:${process.env.PATH}`;
      }
      return true;
    } catch (error) {
      console.error("Error adding Bun to PATH:", (error as Error).message);
      return false;
    }
  }

  /**
   * Verifies that Bun installation was successful
   * @param platform - Current platform
   * @returns True if verification successful
   * @private
   */
  private static _verifyInstallation(platform: string): boolean {
    const verifyResult = shell.exec("bun --version", { silent: true });

    if (verifyResult.code === 0) {
      console.log(
        `Bun verification successful (version: ${verifyResult.stdout.trim()})`
      );
      return true;
    } else {
      console.warn(
        "Bun was installed but verification failed. You may need to restart your terminal or reload your shell profile."
      );
      if (platform === PLATFORMS.WINDOWS) {
        console.warn(
          "On Windows, you might need to restart your command prompt or PowerShell session."
        );
      }
      return false;
    }
  }

  /**
   * Ensures Bun is available for use
   * @returns True if Bun is available
   */
  static ensureAvailable(): boolean {
    if (this.isInstalled()) {
      return true;
    }

    const installed = this.install();
    if (!installed) {
      console.warn(
        "Continuing without Bun. Some features may not work as expected."
      );
    }
    return installed;
  }
}

