#!/usr/bin/env node
"use strict";
/**
 * React Native App Starter CLI
 * A CLI tool to bootstrap React Native applications with TypeScript boilerplate
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const constants_1 = require("./src/config/constants");
const validation_1 = require("./src/utils/validation");
const AppOrchestrator_1 = __importDefault(require("./src/AppOrchestrator"));
const UIService_1 = __importDefault(require("./src/services/UIService"));
const package_json_1 = __importDefault(require("./package.json"));
// Configure commander
commander_1.program
    .name("react-native-app-starter")
    .description("CLI to bootstrap React Native applications with TypeScript")
    .version(package_json_1.default.version)
    .option("--pm <manager>", "Package manager to use (npm, yarn, bun)", "bun")
    .argument("[project-name]", "Name of the project to create")
    .parse();
const programOptions = commander_1.program.opts();
const [projectName] = commander_1.program.args;
/**
 * Main CLI function
 */
async function main() {
    try {
        let directoryName = projectName;
        const packageManager = programOptions.pm;
        // Validate package manager
        if (!["npm", "yarn", "bun"].includes(packageManager)) {
            UIService_1.default.displayError(`Invalid package manager: ${packageManager}. Supported: npm, yarn, bun`);
            return;
        }
        // If no project name provided, prompt user
        if (!directoryName || directoryName.length === 0) {
            directoryName = await UIService_1.default.promptForProjectName();
            const includeHusky = await UIService_1.default.promptForHusky();
            await AppOrchestrator_1.default.createProject(constants_1.REPOSITORY_URLS.TYPESCRIPT, directoryName, includeHusky, packageManager);
            return;
        }
        // Validate directory name
        if (!(0, validation_1.isValidDirectoryName)(directoryName)) {
            UIService_1.default.displayError(constants_1.ERROR_MESSAGES.INVALID_DIRECTORY);
            return;
        }
        // Create TypeScript project with specified package manager
        const includeHusky = await UIService_1.default.promptForHusky();
        console.log(`Creating project "${directoryName}" with package manager "${packageManager}"...`);
        await AppOrchestrator_1.default.createProject(constants_1.REPOSITORY_URLS.TYPESCRIPT, directoryName, includeHusky, packageManager);
    }
    catch (error) {
        UIService_1.default.displayError(`An error occurred: ${error.message}`);
        process.exit(1);
    }
}
// Run the CLI
main();
//# sourceMappingURL=index.js.map