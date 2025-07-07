"use strict";
/**
 * Main application orchestrator
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shell = __importStar(require("shelljs"));
const constants_1 = require("./config/constants");
const validation_1 = require("./utils/validation");
const fileSystem_1 = require("./utils/fileSystem");
const DependencyService_1 = __importDefault(require("./services/DependencyService"));
const ProjectService_1 = __importDefault(require("./services/ProjectService"));
const UIService_1 = __importDefault(require("./services/UIService"));
const PackageManagerService_1 = __importDefault(require("./services/PackageManagerService"));
class AppOrchestrator {
    /**
     * Main project creation function
     * @param repositoryUrl - Git repository URL
     * @param directoryName - Project directory name
     * @param includeHusky - Whether to include Husky
     * @param packageManager - Package manager to use (npm, yarn, bun)
     */
    static async createProject(repositoryUrl, directoryName, includeHusky, packageManager = "bun") {
        console.log(`Creating new project ${directoryName} with ${packageManager}`);
        // Check and install package manager if needed
        const packageManagerAvailable = await PackageManagerService_1.default.ensureAvailable(packageManager);
        if (!packageManagerAvailable) {
            console.warn(`Continuing without ${packageManager}. Some features may not work as expected.`);
        }
        // Generate temporary directory name
        const tmpDir = "temp" + (0, validation_1.randomNameGenerator)(5);
        try {
            // Clone template repository
            await this._cloneTemplate(repositoryUrl, tmpDir);
            // Get template dependencies
            const { tempDependencies, tempDevDependencies } = this._getTemplateDependencies(tmpDir);
            // Initialize React Native project
            await this._initializeReactNativeProject(directoryName, packageManager);
            // Process and install dependencies
            await this._processDependencies(directoryName, tempDependencies, tempDevDependencies, packageManager);
            // Handle Husky removal if not needed
            if (!includeHusky) {
                this._removeHusky(directoryName, packageManager);
            }
            // Copy project assets and configuration
            ProjectService_1.default.copyProjectAssets(tmpDir, directoryName);
            // Handle TypeScript specific files
            if (repositoryUrl === constants_1.REPOSITORY_URLS.TYPESCRIPT) {
                this._handleTypescriptFiles(tmpDir, directoryName);
            }
            else {
                shell.rm("-rf", `${directoryName}/App.js`);
            }
            // Configure project
            ProjectService_1.default.addScripts(directoryName, includeHusky);
            ProjectService_1.default.modifyAndroidBuildGradle(directoryName);
            ProjectService_1.default.ensureTsconfigCompilerOptions(directoryName);
            // Setup Husky if needed
            if (includeHusky) {
                this._moveHuskyFiles(tmpDir, directoryName);
                ProjectService_1.default.setupHusky(directoryName);
            }
            // Final configuration
            ProjectService_1.default.setupGitignore(directoryName);
            ProjectService_1.default.runPostInstallScripts(directoryName);
            UIService_1.default.displaySuccessMessage(directoryName);
        }
        catch (error) {
            console.error(`An error occurred: ${error.message}`);
            throw error;
        }
        finally {
            // Clean up temporary directory
            console.log("Cleaning up temporary files...");
            (0, fileSystem_1.safeRemove)(tmpDir);
        }
    }
    /**
     * Clones the template repository
     * @param repositoryUrl - Repository URL
     * @param tmpDir - Temporary directory name
     * @private
     */
    static async _cloneTemplate(repositoryUrl, tmpDir) {
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
    static _getTemplateDependencies(tmpDir) {
        const packageJson = (0, fileSystem_1.readJsonFile)(`${tmpDir}/package.json`);
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
    static async _initializeReactNativeProject(directoryName, packageManager) {
        console.log(`Initializing React Native project with ${packageManager}...`);
        // Use the package manager directly for React Native CLI
        const initCommand = `echo N | npx @react-native-community/cli init ${directoryName} --pm ${packageManager}`;
        const result = shell.exec(initCommand);
        if (result.code !== 0) {
            throw new Error("Failed to initialize React Native project");
        }
        // Run install command in the project directory using the selected package manager
        const installCommand = PackageManagerService_1.default.getCommand(packageManager, "install");
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
    static async _processDependencies(directoryName, tempDependencies, tempDevDependencies, packageManager) {
        try {
            const { dependenciesToInstall, devDependenciesToInstall } = await DependencyService_1.default.processDependenciesWithVersionCheck(directoryName, tempDependencies, tempDevDependencies);
            DependencyService_1.default.installDependencies(directoryName, dependenciesToInstall, devDependenciesToInstall, shell, packageManager);
        }
        catch (error) {
            console.error("Error processing dependencies:", error.message);
            DependencyService_1.default.fallbackInstallation(directoryName, tempDependencies, tempDevDependencies, shell, packageManager);
        }
    }
    /**
     * Removes Husky from project
     * @param directoryName - Project directory
     * @param packageManager - Package manager to use
     * @private
     */
    static _removeHusky(directoryName, packageManager) {
        const shellOptions = { cwd: `${process.cwd()}/${directoryName}` };
        const removeCommand = PackageManagerService_1.default.getCommand(packageManager, "remove");
        shell.exec(`${removeCommand} husky`, shellOptions);
    }
    /**
     * Handles TypeScript specific files
     * @param tmpDir - Temporary directory
     * @param directoryName - Project directory
     * @private
     */
    static _handleTypescriptFiles(tmpDir, directoryName) {
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
    static _moveHuskyFiles(tmpDir, directoryName) {
        shell.rm("-rf", `${directoryName}/.husky`);
        shell.mv(`${tmpDir}/.husky`, `${directoryName}`);
    }
}
exports.default = AppOrchestrator;
//# sourceMappingURL=AppOrchestrator.js.map