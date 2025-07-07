"use strict";
/**
 * Project setup and configuration service
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
const fs_1 = require("fs");
const os = __importStar(require("os"));
const shell = __importStar(require("shelljs"));
const fileSystem_1 = require("../utils/fileSystem");
class ProjectService {
    /**
     * Adds custom scripts to package.json
     * @param directory - Project directory
     * @param includeHusky - Whether to include husky scripts
     */
    static addScripts(directory, includeHusky) {
        console.log("Adding additional scripts...");
        const packageJsonPath = `${directory}/package.json`;
        const packageJSON = (0, fileSystem_1.readJsonFile)(packageJsonPath);
        const customScripts = {
            postinstall: "sh postinstall",
            lint: "eslint .",
            "lint:fix": "eslint . --fix",
            prepare: "husky init",
            "bundle-android": "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
            "bundle-ios": "npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle",
            "release-ios-changelog": "bun install && bun run generate-changelog && fastlane ios beta",
            "release-android-changelog": "bun install && bun run generate-changelog && fastlane android beta",
            "release-ios-changelog-bump": "bun install && bun run generate-changelog-bump && fastlane ios beta",
            "release-android-changelog-bump": "bun install && bun run generate-changelog-bump && fastlane android beta",
            "generate-changelog": 'fastlane changelog build_changelog bump_type:"patch"',
            "generate-changelog-bump": "fastlane changelog build_changelog",
            "release-ios": "bun install && fastlane ios beta",
            "release-android": "bun install && fastlane android beta",
            release: "bun run generate-changelog && bun run release-android && bun run release-ios",
            "release-bump": "bun run generate-changelog-bump && bun run release-android && bun run release-ios",
        };
        packageJSON.scripts = {
            ...packageJSON.scripts,
            ...customScripts,
        };
        if (!includeHusky) {
            delete packageJSON.scripts?.prepare;
        }
        (0, fileSystem_1.writeJsonFile)(packageJsonPath, packageJSON);
        console.log("Added scripts to package.json");
    }
    /**
     * Modifies Android build.gradle file
     * @param directoryName - Project directory name
     */
    static modifyAndroidBuildGradle(directoryName) {
        console.log("Configuring Android build.gradle...");
        const buildGradlePath = `${directoryName}/android/app/build.gradle`;
        try {
            if (!(0, fs_1.existsSync)(buildGradlePath)) {
                console.warn(`build.gradle not found at ${buildGradlePath}`);
                return;
            }
            const buildGradleContent = (0, fs_1.readFileSync)(buildGradlePath, "utf8");
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
                lines.splice(lastApplyPluginIndex + 1, 0, "apply from: project(':react-native-config').projectDir.getPath() + \"/dotenv.gradle\"");
                // Write the modified content back to the file
                (0, fs_1.writeFileSync)(buildGradlePath, lines.join("\n"));
                console.log("Added react-native-config dotenv.gradle to android/app/build.gradle");
            }
            else {
                console.warn("Could not find 'apply plugin' lines in android/app/build.gradle");
            }
        }
        catch (error) {
            console.error(`Error modifying android/app/build.gradle: ${error.message}`);
        }
    }
    /**
     * Ensures tsconfig.json has compilerOptions
     * @param directoryName - Project directory name
     */
    static ensureTsconfigCompilerOptions(directoryName) {
        const tsconfigPath = `${directoryName}/tsconfig.json`;
        try {
            // Check if tsconfig.json exists
            if (!(0, fs_1.existsSync)(tsconfigPath)) {
                console.log("tsconfig.json not found, creating a new one...");
                const defaultTsconfig = {
                    compilerOptions: {},
                };
                (0, fs_1.writeFileSync)(tsconfigPath, JSON.stringify(defaultTsconfig, null, 2));
                console.log("Created tsconfig.json with compilerOptions");
                return;
            }
            // Read existing tsconfig.json
            const tsconfigContent = (0, fs_1.readFileSync)(tsconfigPath, "utf8");
            let tsconfig;
            try {
                tsconfig = JSON.parse(tsconfigContent);
            }
            catch (parseError) {
                console.warn("Invalid JSON in tsconfig.json, creating a new one...");
                tsconfig = {};
            }
            // Ensure compilerOptions exists as an object
            if (!tsconfig.compilerOptions ||
                typeof tsconfig.compilerOptions !== "object") {
                tsconfig.compilerOptions = {};
                (0, fs_1.writeFileSync)(tsconfigPath, JSON.stringify(tsconfig, null, 2));
                console.log("Added compilerOptions to tsconfig.json");
            }
            else {
                console.log("compilerOptions already exists in tsconfig.json");
            }
        }
        catch (error) {
            console.error(`Error modifying tsconfig.json: ${error.message}`);
        }
    }
    /**
     * Copies project assets from template
     * @param tmpDir - Template directory
     * @param directoryName - Target directory
     */
    static copyProjectAssets(tmpDir, directoryName) {
        console.log("Copying project assets...");
        try {
            // Split directory name for nested projects
            const projectDirectories = directoryName.split("/");
            const finalProjectName = projectDirectories[projectDirectories.length - 1];
            // Copy Android resources
            shell
                .ls(`${tmpDir}/android/app/src/main/res/drawable/`)
                .forEach((file) => {
                shell.cp("-rf", `${tmpDir}/android/app/src/main/res/drawable/${file}`, `${directoryName}/android/app/src/main/res/drawable/`);
            });
            // Copy iOS resources
            shell
                .ls(`${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/`)
                .forEach((file) => {
                shell.cp("-rf", `${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/${file}`, `${directoryName}/ios/${finalProjectName}/Images.xcassets/`);
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
                if ((0, fs_1.existsSync)(`${tmpDir}/${file}`)) {
                    shell.mv(`${tmpDir}/${file}`, `${directoryName}`);
                }
            });
            console.log("Project assets copied successfully");
        }
        catch (error) {
            console.error(`Error copying project assets: ${error.message}`);
            throw error;
        }
    }
    /**
     * Sets up Husky hooks
     * @param directoryName - Project directory name
     */
    static setupHusky(directoryName) {
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
            (0, fs_1.writeFileSync)(preCommitHookPath, preCommitContent);
            // Make the hook executable on Unix systems
            if (os.platform() !== "win32") {
                shell.exec(`chmod +x ${preCommitHookPath}`);
            }
            console.log("Pre-commit hook configured with lint:fix");
        }
        catch (error) {
            console.error(`Error setting up pre-commit hook: ${error.message}`);
        }
    }
    /**
     * Sets up .gitignore file
     * @param directoryName - Project directory name
     */
    static setupGitignore(directoryName) {
        console.log("Setting up .gitignore");
        shell.exec(`echo "\n.env\n\!**/fastlane/.env" >> ${directoryName}/.gitignore`);
    }
    /**
     * Runs post-installation scripts
     * @param directoryName - Project directory name
     */
    static runPostInstallScripts(directoryName) {
        console.log("Running post-installation scripts...");
        const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };
        if (os.platform() !== "win32") {
            shell.exec("sh postinstall", shellOptions);
        }
        else {
            shell.exec("node ./moduleResolver.js", shellOptions);
            shell.exec("node ./env.config/env.config.js", shellOptions);
        }
    }
}
exports.default = ProjectService;
//# sourceMappingURL=ProjectService.js.map