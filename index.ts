#!/usr/bin/env node

/**
 * React Native App Starter CLI
 * A CLI tool to bootstrap React Native applications with TypeScript boilerplate
 */

import { program } from "commander";

import { REPOSITORY_URLS, ERROR_MESSAGES } from "./src/config/constants";
import { isValidDirectoryName } from "./src/utils/validation";
import AppOrchestrator from "./src/AppOrchestrator";
import UIService from "./src/services/UIService";
import packageJson from "./package.json";
import { PackageManager } from "./src/types";

// Configure commander
program
  .name("react-native-app-starter")
  .description("CLI to bootstrap React Native applications with TypeScript")
  .version(packageJson.version)
  .option("--pm <manager>", "Package manager to use (npm, yarn, bun)", "bun")
  .argument("[project-name]", "Name of the project to create")
  .parse();

const programOptions = program.opts();
const [projectName] = program.args;

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  try {
    let directoryName = projectName;
    const packageManager = programOptions.pm as PackageManager;

    // Validate package manager
    if (!["npm", "yarn", "bun"].includes(packageManager)) {
      UIService.displayError(
        `Invalid package manager: ${packageManager}. Supported: npm, yarn, bun`
      );
      return;
    }

    // If no project name provided, prompt user
    if (!directoryName || directoryName.length === 0) {
      directoryName = await UIService.promptForProjectName();
      const includeHusky = await UIService.promptForHusky();

      await AppOrchestrator.createProject(
        REPOSITORY_URLS.TYPESCRIPT,
        directoryName,
        includeHusky,
        packageManager
      );
      return;
    }

    // Validate directory name
    if (!isValidDirectoryName(directoryName)) {
      UIService.displayError(ERROR_MESSAGES.INVALID_DIRECTORY);
      return;
    }

    // Create TypeScript project with specified package manager
    const includeHusky = await UIService.promptForHusky();

    console.log(
      `Creating project "${directoryName}" with package manager "${packageManager}"...`
    );

    await AppOrchestrator.createProject(
      REPOSITORY_URLS.TYPESCRIPT,
      directoryName,
      includeHusky,
      packageManager
    );
  } catch (error) {
    UIService.displayError(`An error occurred: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run the CLI
main();

