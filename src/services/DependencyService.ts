/**
 * Dependency management service
 */

import { readJsonFile } from "../utils/fileSystem";
import { compareVersions, isStaticVersion } from "../utils/version";
import { PackageManager } from "../types";
import PackageManagerService from "./PackageManagerService";

interface DependencyProcessResult {
  dependenciesToInstall: string[];
  devDependenciesToInstall: string[];
}

export default class DependencyService {
  /**
   * Processes dependencies with version checking
   * @param directoryName - Project directory name
   * @param tempDependencies - Dependencies from template
   * @param tempDevDependencies - Dev dependencies from template
   * @returns Object with dependencies to install
   */
  static async processDependenciesWithVersionCheck(
    directoryName: string,
    tempDependencies: Record<string, string>,
    tempDevDependencies: Record<string, string>
  ): Promise<DependencyProcessResult> {
    const projectPackageJsonPath = `${directoryName}/package.json`;
    const projectPackageJson = readJsonFile(projectPackageJsonPath);

    const projectDependencies = projectPackageJson.dependencies || {};
    const projectDevDependencies = projectPackageJson.devDependencies || {};

    const dependenciesToInstall: string[] = [];
    const devDependenciesToInstall: string[] = [];

    console.log("Processing dependencies with version checking...");

    // Process regular dependencies
    for (const [depName, tempVersion] of Object.entries(tempDependencies)) {
      const packageToInstall = this._shouldInstallDependency(
        depName,
        tempVersion,
        projectDependencies[depName],
        "dependency"
      );

      if (packageToInstall) {
        dependenciesToInstall.push(packageToInstall);
      }
    }

    // Process dev dependencies
    for (const [depName, tempVersion] of Object.entries(tempDevDependencies)) {
      const packageToInstall = this._shouldInstallDependency(
        depName,
        tempVersion,
        projectDevDependencies[depName],
        "dev dependency"
      );

      if (packageToInstall) {
        devDependenciesToInstall.push(packageToInstall);
      }
    }

    console.log(`\nDependency processing complete:`);
    console.log(
      `- ${dependenciesToInstall.length} regular dependencies to install/update`
    );
    console.log(
      `- ${devDependenciesToInstall.length} dev dependencies to install/update`
    );

    return { dependenciesToInstall, devDependenciesToInstall };
  }

  /**
   * Determines if a dependency should be installed/updated
   * @param depName - Dependency name
   * @param tempVersion - Version from template
   * @param existingVersion - Existing version in project
   * @param depType - Type of dependency (for logging)
   * @returns Package string to install or null if no action needed
   * @private
   */
  private static _shouldInstallDependency(
    depName: string,
    tempVersion: string,
    existingVersion: string | undefined,
    depType: string
  ): string | null {
    if (!existingVersion) {
      // Dependency doesn't exist in project, add it
      console.log(`Adding new ${depType}: ${depName}@${tempVersion}`);
      return `${depName}@${tempVersion}`;
    }

    if (isStaticVersion(tempVersion)) {
      // Temp has static version, check if project version is higher
      const comparison = compareVersions(existingVersion, tempVersion);
      if (comparison < 0) {
        // Project version is lower, use temp version
        console.log(
          `Updating ${depType} ${depName} from ${existingVersion} to ${tempVersion} (static version from template)`
        );
        return `${depName}@${tempVersion}`;
      } else {
        console.log(
          `Keeping existing ${depType} ${depName}@${existingVersion} (version ${
            comparison === 0 ? "same as" : "higher than"
          } template's ${tempVersion})`
        );
        return null;
      }
    } else {
      // Temp doesn't have static version, check if we should update
      const comparison = compareVersions(existingVersion, tempVersion);
      if (comparison < 0) {
        console.log(
          `Updating ${depType} ${depName} from ${existingVersion} to ${tempVersion} (template version)`
        );
        return `${depName}@${tempVersion}`;
      } else {
        console.log(
          `Keeping existing ${depType} ${depName}@${existingVersion} (version ${
            comparison === 0 ? "same as" : "higher than"
          } template's ${tempVersion})`
        );
        return null;
      }
    }
  }

  /**
   * Installs dependencies using specified package manager
   * @param directoryName - Project directory
   * @param dependencies - Regular dependencies to install
   * @param devDependencies - Dev dependencies to install
   * @param shell - Shell instance for executing commands
   * @param packageManager - Package manager to use
   */
  static installDependencies(
    directoryName: string,
    dependencies: string[],
    devDependencies: string[],
    shell: typeof import("shelljs"),
    packageManager: PackageManager = "bun"
  ): void {
    const shellOptions = {
      cwd: `${process.cwd()}/${directoryName}`,
    };

    if (dependencies.length > 0) {
      console.log(
        `Installing dependencies with ${packageManager}:`,
        dependencies
      );
      const addCommand = PackageManagerService.getCommand(
        packageManager,
        "add"
      );
      console.log(`Running: ${addCommand} ${dependencies.join(" ")}`);
      shell.exec(`${addCommand} ${dependencies.join(" ")}`, shellOptions);
    }

    if (devDependencies.length > 0) {
      console.log(
        `Installing dev dependencies with ${packageManager}:`,
        devDependencies
      );
      const addDevCommand = PackageManagerService.getCommand(
        packageManager,
        "add-dev"
      );
      console.log(`Running: ${addDevCommand} ${devDependencies.join(" ")}`);
      shell.exec(`${addDevCommand} ${devDependencies.join(" ")}`, shellOptions);
    }
  }

  /**
   * Fallback installation of all dependencies from template
   * @param directoryName - Project directory
   * @param tempDependencies - Dependencies from template
   * @param tempDevDependencies - Dev dependencies from template
   * @param shell - Shell instance for executing commands
   * @param packageManager - Package manager to use
   */
  static fallbackInstallation(
    directoryName: string,
    tempDependencies: Record<string, string>,
    tempDevDependencies: Record<string, string>,
    shell: typeof import("shelljs"),
    packageManager: PackageManager = "bun"
  ): void {
    console.log("Falling back to installing all dependencies from template...");

    const shellOptions = {
      cwd: `${process.cwd()}/${directoryName}`,
    };

    const dependencyList = Object.keys(tempDependencies);
    const devDependencyList = Object.keys(tempDevDependencies);

    if (dependencyList.length > 0) {
      const addCommand = PackageManagerService.getCommand(
        packageManager,
        "add"
      );
      shell.exec(`${addCommand} ${dependencyList.join(" ")}`, shellOptions);
    }
    if (devDependencyList.length > 0) {
      const addDevCommand = PackageManagerService.getCommand(
        packageManager,
        "add-dev"
      );
      shell.exec(
        `${addDevCommand} ${devDependencyList.join(" ")}`,
        shellOptions
      );
    }
  }
}

