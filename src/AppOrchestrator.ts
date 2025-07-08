/**
 * Main application orchestrator
 */

import * as shell from "shelljs";

import { REPOSITORY_URLS } from "./config/constants";
import { randomNameGenerator } from "./utils/validation";
import { readJsonFile, safeRemove } from "./utils/fileSystem";

import DependencyService from "./services/DependencyService";
import ProjectService from "./services/ProjectService";
import UIService from "./services/UIService";
import PackageManagerService from "./services/PackageManagerService";
import { PackageManager } from "./types";

export default class AppOrchestrator {
  /**
   * Main project creation function
   * @param repositoryUrl - Git repository URL
   * @param directoryName - Project directory name
   * @param includeHusky - Whether to include Husky
   * @param packageManager - Package manager to use (npm, yarn, bun)
   */
  static async createProject(
    repositoryUrl: string,
    directoryName: string,
    includeHusky: boolean,
    packageManager: PackageManager = "bun"
  ): Promise<void> {
    console.log(`Creating new project ${directoryName} with ${packageManager}`);

    // Check and install package manager if needed
    const packageManagerAvailable = await PackageManagerService.ensureAvailable(
      packageManager
    );
    if (!packageManagerAvailable) {
      console.warn(
        `Continuing without ${packageManager}. Some features may not work as expected.`
      );
    }

    // Generate temporary directory name
    const tmpDir = "temp" + randomNameGenerator(5);

    try {
      // Clone template repository
      await this._cloneTemplate(repositoryUrl, tmpDir);

      // Get template dependencies
      const { tempDependencies, tempDevDependencies } =
        this._getTemplateDependencies(tmpDir);

      // Initialize React Native project
      await this._initializeReactNativeProject(directoryName, packageManager);

      // Process and install dependencies
      await this._processDependencies(
        directoryName,
        tempDependencies,
        tempDevDependencies,
        packageManager
      );

      // Handle Husky removal if not needed
      if (!includeHusky) {
        this._removeHusky(directoryName, packageManager);
      }

      // Copy project assets and configuration
      ProjectService.copyProjectAssets(tmpDir, directoryName);

      // Handle TypeScript specific files
      if (repositoryUrl === REPOSITORY_URLS.TYPESCRIPT) {
        this._handleTypescriptFiles(tmpDir, directoryName);
      } else {
        shell.rm("-rf", `${directoryName}/App.js`);
      }

      // Configure project
      ProjectService.addScripts(directoryName, includeHusky);
      ProjectService.modifyAndroidBuildGradle(directoryName);
      ProjectService.ensureTsconfigCompilerOptions(directoryName);

      // Setup Husky if needed
      if (includeHusky) {
        this._moveHuskyFiles(tmpDir, directoryName);
        ProjectService.setupHusky(directoryName);
      }

      // Final configuration
      ProjectService.setupGitignore(directoryName);
      ProjectService.createPostinstallScripts(directoryName);
      ProjectService.runPostInstallScripts(directoryName);

      UIService.displaySuccessMessage(directoryName);
    } catch (error) {
      console.error(`An error occurred: ${(error as Error).message}`);
      throw error;
    } finally {
      // Clean up temporary directory
      console.log("Cleaning up temporary files...");
      safeRemove(tmpDir);
    }
  }

  /**
   * Clones the template repository
   * @param repositoryUrl - Repository URL
   * @param tmpDir - Temporary directory name
   * @private
   */
  private static async _cloneTemplate(
    repositoryUrl: string,
    tmpDir: string
  ): Promise<void> {
    console.log("Cloning template repository...");
    const result = shell.exec(`git clone ${repositoryUrl} ${tmpDir}`);
    if (result.code !== 0) {
      throw new Error(`Failed to clone repository: ${repositoryUrl}`);
    }
  }

  /**
   * Gets dependencies from template package.json
   * @param tmpDir - Temporary directory
   * @returns Template dependencies
   * @private
   */
  private static _getTemplateDependencies(tmpDir: string): {
    tempDependencies: Record<string, string>;
    tempDevDependencies: Record<string, string>;
  } {
    const packageJson = readJsonFile(`${tmpDir}/package.json`);
    return {
      tempDependencies: packageJson.dependencies || {},
      tempDevDependencies: packageJson.devDependencies || {},
    };
  }

  /**
   * Initializes React Native project
   * @param directoryName - Project directory name
   * @param packageManager - Package manager to use
   * @private
   */
  private static async _initializeReactNativeProject(
    directoryName: string,
    packageManager: PackageManager
  ): Promise<void> {
    console.log(`Initializing React Native project with ${packageManager}...`);

    // Use the package manager directly for React Native CLI
    const initCommand = `echo N | npx @react-native-community/cli init ${directoryName} --pm ${packageManager}`;

    const result = shell.exec(initCommand);

    if (result.code !== 0) {
      throw new Error("Failed to initialize React Native project");
    }

    // Run install command in the project directory using the selected package manager
    const installCommand = PackageManagerService.getCommand(
      packageManager,
      "install"
    );
    console.log(`Installing dependencies with: ${installCommand}`);
    const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };
    shell.exec(installCommand, shellOptions);
  }

  /**
   * Processes and installs dependencies
   * @param directoryName - Project directory
   * @param tempDependencies - Template dependencies
   * @param tempDevDependencies - Template dev dependencies
   * @param packageManager - Package manager to use
   * @private
   */
  private static async _processDependencies(
    directoryName: string,
    tempDependencies: Record<string, string>,
    tempDevDependencies: Record<string, string>,
    packageManager: PackageManager
  ): Promise<void> {
    try {
      const { dependenciesToInstall, devDependenciesToInstall } =
        await DependencyService.processDependenciesWithVersionCheck(
          directoryName,
          tempDependencies,
          tempDevDependencies
        );

      DependencyService.installDependencies(
        directoryName,
        dependenciesToInstall,
        devDependenciesToInstall,
        shell,
        packageManager
      );
    } catch (error) {
      console.error("Error processing dependencies:", (error as Error).message);
      DependencyService.fallbackInstallation(
        directoryName,
        tempDependencies,
        tempDevDependencies,
        shell,
        packageManager
      );
    }
  }

  /**
   * Removes Husky from project
   * @param directoryName - Project directory
   * @param packageManager - Package manager to use
   * @private
   */
  private static _removeHusky(
    directoryName: string,
    packageManager: PackageManager
  ): void {
    const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };
    const removeCommand = PackageManagerService.getCommand(
      packageManager,
      "remove"
    );
    shell.exec(`${removeCommand} husky`, shellOptions);
  }

  /**
   * Handles TypeScript specific files
   * @param tmpDir - Temporary directory
   * @param directoryName - Project directory
   * @private
   */
  private static _handleTypescriptFiles(
    tmpDir: string,
    directoryName: string
  ): void {
    shell.rm("-rf", `${directoryName}/index.js`);
    shell.mv(`${tmpDir}/index.js`, `${directoryName}`);
    shell.rm("-rf", `${directoryName}/App.tsx`);
  }

  /**
   * Moves Husky files from template
   * @param tmpDir - Temporary directory
   * @param directoryName - Project directory
   * @private
   */
  private static _moveHuskyFiles(tmpDir: string, directoryName: string): void {
    shell.rm("-rf", `${directoryName}/.husky`);
    shell.mv(`${tmpDir}/.husky`, `${directoryName}`);
  }
}

