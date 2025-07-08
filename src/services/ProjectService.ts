/**
 * Project setup and configuration service
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import * as os from "os";
import * as shell from "shelljs";
import { readJsonFile, writeJsonFile } from "../utils/fileSystem";

export default class ProjectService {
  /**
   * Adds custom scripts to package.json
   * @param directory - Project directory
   * @param includeHusky - Whether to include husky scripts
   */
  static addScripts(directory: string, includeHusky: boolean): void {
    console.log("Adding additional scripts...");

    const packageJsonPath = `${directory}/package.json`;
    const packageJSON = readJsonFile(packageJsonPath);

    const customScripts = {
      postinstall: "./postinstall",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      prepare: "husky init",
      "bundle-android":
        "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
      "bundle-ios":
        "npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle",
      "release-ios-changelog":
        "bun install && bun run generate-changelog && fastlane ios beta",
      "release-android-changelog":
        "bun install && bun run generate-changelog && fastlane android beta",
      "release-ios-changelog-bump":
        "bun install && bun run generate-changelog-bump && fastlane ios beta",
      "release-android-changelog-bump":
        "bun install && bun run generate-changelog-bump && fastlane android beta",
      "generate-changelog":
        'fastlane changelog build_changelog bump_type:"patch"',
      "generate-changelog-bump": "fastlane changelog build_changelog",
      "release-ios": "bun install && fastlane ios beta",
      "release-android": "bun install && fastlane android beta",
      release:
        "bun run generate-changelog && bun run release-android && bun run release-ios",
      "release-bump":
        "bun run generate-changelog-bump && bun run release-android && bun run release-ios",
    };

    packageJSON.scripts = {
      ...packageJSON.scripts,
      ...customScripts,
    };

    if (!includeHusky) {
      delete packageJSON.scripts?.prepare;
    }

    writeJsonFile(packageJsonPath, packageJSON);
    console.log("Added scripts to package.json");
  }

  /**
   * Modifies Android build.gradle file
   * @param directoryName - Project directory name
   */
  static modifyAndroidBuildGradle(directoryName: string): void {
    console.log("Configuring Android build.gradle...");

    const buildGradlePath = `${directoryName}/android/app/build.gradle`;

    try {
      if (!existsSync(buildGradlePath)) {
        console.warn(`build.gradle not found at ${buildGradlePath}`);
        return;
      }

      const buildGradleContent = readFileSync(buildGradlePath, "utf8");
      const lines = buildGradleContent.split("\n");
      let lastApplyPluginIndex = -1;

      // Find the last occurrence of "apply plugin"
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith("apply plugin")) {
          lastApplyPluginIndex = i;
        }
      }

      if (lastApplyPluginIndex !== -1) {
        // Insert the new line after the last "apply plugin" line
        lines.splice(
          lastApplyPluginIndex + 1,
          0,
          "apply from: project(':react-native-config').projectDir.getPath() + \"/dotenv.gradle\""
        );

        // Write the modified content back to the file
        writeFileSync(buildGradlePath, lines.join("\n"));
        console.log(
          "Added react-native-config dotenv.gradle to android/app/build.gradle"
        );
      } else {
        console.warn(
          "Could not find 'apply plugin' lines in android/app/build.gradle"
        );
      }
    } catch (error) {
      console.error(
        `Error modifying android/app/build.gradle: ${(error as Error).message}`
      );
    }
  }

  /**
   * Ensures tsconfig.json has compilerOptions
   * @param directoryName - Project directory name
   */
  static ensureTsconfigCompilerOptions(directoryName: string): void {
    const tsconfigPath = `${directoryName}/tsconfig.json`;

    try {
      // Check if tsconfig.json exists
      if (!existsSync(tsconfigPath)) {
        console.log("tsconfig.json not found, creating a new one...");
        const defaultTsconfig = {
          compilerOptions: {},
        };
        writeFileSync(tsconfigPath, JSON.stringify(defaultTsconfig, null, 2));
        console.log("Created tsconfig.json with compilerOptions");
        return;
      }

      // Read existing tsconfig.json
      const tsconfigContent = readFileSync(tsconfigPath, "utf8");
      let tsconfig: any;

      try {
        tsconfig = JSON.parse(tsconfigContent);
      } catch (parseError) {
        console.warn("Invalid JSON in tsconfig.json, creating a new one...");
        tsconfig = {};
      }

      // Ensure compilerOptions exists as an object
      if (
        !tsconfig.compilerOptions ||
        typeof tsconfig.compilerOptions !== "object"
      ) {
        tsconfig.compilerOptions = {};
        writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        console.log("Added compilerOptions to tsconfig.json");
      } else {
        console.log("compilerOptions already exists in tsconfig.json");
      }
    } catch (error) {
      console.error(
        `Error modifying tsconfig.json: ${(error as Error).message}`
      );
    }
  }

  /**
   * Copies project assets from template
   * @param tmpDir - Template directory
   * @param directoryName - Target directory
   */
  static copyProjectAssets(tmpDir: string, directoryName: string): void {
    console.log("Copying project assets...");

    try {
      // Split directory name for nested projects
      const projectDirectories = directoryName.split("/");
      const finalProjectName =
        projectDirectories[projectDirectories.length - 1];

      // Copy Android resources
      shell
        .ls(`${tmpDir}/android/app/src/main/res/drawable/`)
        .forEach((file) => {
          shell.cp(
            "-rf",
            `${tmpDir}/android/app/src/main/res/drawable/${file}`,
            `${directoryName}/android/app/src/main/res/drawable/`
          );
        });

      // Copy iOS resources
      shell
        .ls(`${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/`)
        .forEach((file) => {
          shell.cp(
            "-rf",
            `${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/${file}`,
            `${directoryName}/ios/${finalProjectName}/Images.xcassets/`
          );
        });

      // Common files to copy
      const filesToCopy = [
        "App",
        ".env",
        "fastlane",
        "babel.config.js",
        "moduleResolver.js",
        "modules.json",
        "postinstall",
        ".prettierrc.js",
        "env.config",
        "react-native-config.d.ts",
      ];

      filesToCopy.forEach((file) => {
        if (existsSync(`${tmpDir}/${file}`)) {
          shell.mv(`${tmpDir}/${file}`, `${directoryName}`);
        }
      });

      console.log("Project assets copied successfully");
    } catch (error) {
      console.error(
        `Error copying project assets: ${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * Sets up Husky hooks
   * @param directoryName - Project directory name
   */
  static setupHusky(directoryName: string): void {
    console.log("Setting up Husky...");

    const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };

    try {
      console.log("Installing husky hooks");
      shell.exec("bun run prepare", shellOptions);

      console.log("Setting up pre-commit hook with lint:fix");
      const preCommitHookPath = `${directoryName}/.husky/pre-commit`;
      const preCommitContent = `#!/bin/sh
bun test
bun lint:fix`;

      writeFileSync(preCommitHookPath, preCommitContent);

      // Make the hook executable on Unix systems
      if (os.platform() !== "win32") {
        shell.exec(`chmod +x ${preCommitHookPath}`);
      }

      console.log("Pre-commit hook configured with lint:fix");
    } catch (error) {
      console.error(
        `Error setting up pre-commit hook: ${(error as Error).message}`
      );
    }
  }

  /**
   * Sets up .gitignore file
   * @param directoryName - Project directory name
   */
  static setupGitignore(directoryName: string): void {
    console.log("Setting up .gitignore");
    shell.exec(
      `echo "\n.env\n\!**/fastlane/.env" >> ${directoryName}/.gitignore`
    );
  }

  /**
   * Creates Windows batch file for postinstall tasks
   * @param directoryName - Project directory name
   */
  static createPostinstallScripts(directoryName: string): void {
    console.log("Creating Windows postinstall batch file...");

    try {
      // Windows batch file content
      const batContent = `@echo off
REM Windows batch file for postinstall tasks

REM Check if bun is available and set the appropriate command
where bun >nul 2>nul
if %errorlevel% == 0 (
    echo Using bun as package manager...
    set "RUNNER=bun"
) else (
    echo Using node as package manager...
    set "RUNNER=node"
)

REM Run moduleResolver.js if it exists
if exist "moduleResolver.js" (
    echo Running moduleResolver.js...
    %RUNNER% ./moduleResolver.js
    if %errorlevel% neq 0 (
        echo Error: moduleResolver.js failed to execute
        exit /b 1
    )
) else (
    echo Warning: moduleResolver.js not found, skipping...
)

REM Run env.config.js if it exists
if exist "env.config\\env.config.js" (
    echo Running env.config/env.config.js...
    %RUNNER% ./env.config/env.config.js
    if %errorlevel% neq 0 (
        echo Error: env.config/env.config.js failed to execute
        exit /b 1
    )
) else (
    echo Warning: env.config/env.config.js not found, skipping...
)

echo Postinstall tasks completed successfully!`;

      // Write only the Windows batch file (postinstall.sh is copied from template)
      writeFileSync(`${directoryName}/postinstall.bat`, batContent);

      console.log("Windows postinstall batch file created successfully");
    } catch (error) {
      console.error(
        `Error creating postinstall batch file: ${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * Runs post-installation scripts
   * @param directoryName - Project directory name
   */
  static runPostInstallScripts(directoryName: string): void {
    console.log("Running post-installation scripts...");

    const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };

    if (os.platform() === "win32") {
      // Windows: Use the batch file
      shell.exec("postinstall.bat", shellOptions);
    } else {
      // Unix-like systems: Use the shell script
      shell.exec("sh postinstall", shellOptions);
    }
  }
}

