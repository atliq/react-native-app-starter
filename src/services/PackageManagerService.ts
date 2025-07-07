/**
 * Package manager installation and management service
 */

import * as os from "os";
import * as shell from "shelljs";
import { PackageManager } from "../types";

export default class PackageManagerService {
  /**
   * Checks if a package manager is installed
   * @param packageManager - Package manager to check
   * @returns True if package manager is installed
   */
  static isInstalled(packageManager: PackageManager): boolean {
    console.log(`Checking if ${packageManager} is installed...`);
    const checkResult = shell.exec(`${packageManager} --version`, {
      silent: true,
    });

    if (checkResult.code === 0) {
      console.log(
        `${packageManager} is already installed (version: ${checkResult.stdout.trim()})`
      );
      return true;
    }
    return false;
  }

  /**
   * Installs a package manager
   * @param packageManager - Package manager to install
   * @returns True if installation was successful
   */
  static async install(packageManager: PackageManager): Promise<boolean> {
    console.log(
      `${packageManager} is not installed. Installing ${packageManager}...`
    );

    const platform = os.platform();

    switch (packageManager) {
      case "bun":
        // Install Bun without asking permission
        return this._installBun(platform);

      case "yarn":
        // Ask permission for Yarn
        const installYarn = await this._askPermissionToInstall("Yarn");
        if (!installYarn) return false;
        return this._installYarn(platform);

      case "npm":
        // npm should come with Node.js, if it's missing something is wrong
        console.error(
          "npm is missing. Please install Node.js from https://nodejs.org/"
        );
        return false;

      default:
        console.error(`Unsupported package manager: ${packageManager}`);
        return false;
    }
  }

  /**
   * Ensures a package manager is available for use
   * @param packageManager - Package manager to ensure
   * @returns True if package manager is available
   */
  static async ensureAvailable(
    packageManager: PackageManager
  ): Promise<boolean> {
    if (this.isInstalled(packageManager)) {
      return true;
    }

    const installed = await this.install(packageManager);
    if (!installed) {
      console.warn(
        `Continuing without ${packageManager}. Some features may not work as expected.`
      );
    }
    return installed;
  }

  /**
   * Gets the appropriate command for the package manager
   * @param packageManager - Package manager
   * @param action - Action to perform (install, add, remove, etc.)
   * @returns Command string
   */
  static getCommand(packageManager: PackageManager, action: string): string {
    switch (packageManager) {
      case "npm":
        if (action === "add") return "npm install";
        if (action === "add-dev") return "npm install --save-dev";
        if (action === "remove") return "npm uninstall";
        return `npm ${action}`;

      case "yarn":
        if (action === "add-dev") return "yarn add --dev";
        return `yarn ${action}`;

      case "bun":
        if (action === "add-dev") return "bun add --dev";
        return `bun ${action}`;

      default:
        return action;
    }
  }

  /**
   * Installs Bun (without asking permission)
   * @param platform - Current platform
   * @returns True if installation was successful
   * @private
   */
  private static _installBun(platform: string): boolean {
    let installResult: shell.ShellString;

    if (platform === "win32") {
      console.log("Detected Windows. Installing Bun using PowerShell...");
      installResult = shell.exec(
        'powershell -c "irm bun.sh/install.ps1 | iex"',
        {
          silent: false,
        }
      );
    } else {
      console.log(
        "Detected Unix-like system. Installing Bun using curl and bash..."
      );
      installResult = shell.exec("curl -fsSL https://bun.sh/install | bash", {
        silent: false,
      });
    }

    if (installResult.code === 0) {
      console.log("Bun installed successfully!");
      return (
        this._addToPath(platform, "bun") &&
        this._verifyInstallation("bun", platform)
      );
    } else {
      console.error(`Failed to install Bun on ${platform}`);
      if (platform === "win32") {
        console.error("For Windows, you can also try: npm install -g bun");
      }
      return false;
    }
  }

  /**
   * Installs Yarn
   * @param platform - Current platform
   * @returns True if installation was successful
   * @private
   */
  private static _installYarn(platform: string): boolean {
    console.log("Installing Yarn via npm...");
    const installResult = shell.exec("npm install -g yarn", { silent: false });

    if (installResult.code === 0) {
      console.log("Yarn installed successfully!");
      return this._verifyInstallation("yarn", platform);
    } else {
      console.error("Failed to install Yarn");
      return false;
    }
  }

  /**
   * Asks user permission to install a package manager
   * @param packageManagerName - Display name of package manager
   * @returns True if user gave permission
   * @private
   */
  private static async _askPermissionToInstall(
    packageManagerName: string
  ): Promise<boolean> {
    console.log(`Do you want to install ${packageManagerName}?`);
    try {
      const cliSelect = (await import("cli-select")).default;
      const result = await cliSelect({
        values: ["Yes", "No"],
      });
      return result.value === "Yes";
    } catch (error) {
      // Fallback if cli-select fails
      return false;
    }
  }

  /**
   * Adds package manager to the current session's PATH
   * @param platform - Current platform
   * @param packageManager - Package manager name
   * @returns True if successfully added to PATH
   * @private
   */
  private static _addToPath(platform: string, packageManager: string): boolean {
    try {
      const homeDir = os.homedir();
      let packagePath: string;

      if (platform === "win32") {
        packagePath = `${homeDir}\\.${packageManager}\\bin`;
        process.env.PATH = `${packagePath};${process.env.PATH}`;
      } else {
        packagePath = `${homeDir}/.${packageManager}/bin`;
        process.env.PATH = `${packagePath}:${process.env.PATH}`;
      }
      return true;
    } catch (error) {
      console.error(
        `Error adding ${packageManager} to PATH:`,
        (error as Error).message
      );
      return false;
    }
  }

  /**
   * Verifies that package manager installation was successful
   * @param packageManager - Package manager to verify
   * @param platform - Current platform
   * @returns True if verification successful
   * @private
   */
  private static _verifyInstallation(
    packageManager: string,
    platform: string
  ): boolean {
    const verifyResult = shell.exec(`${packageManager} --version`, {
      silent: true,
    });

    if (verifyResult.code === 0) {
      console.log(
        `${packageManager} verification successful (version: ${verifyResult.stdout.trim()})`
      );
      return true;
    } else {
      console.warn(
        `${packageManager} was installed but verification failed. You may need to restart your terminal or reload your shell profile.`
      );
      if (platform === "win32") {
        console.warn(
          "On Windows, you might need to restart your command prompt or PowerShell session."
        );
      }
      return false;
    }
  }
}

