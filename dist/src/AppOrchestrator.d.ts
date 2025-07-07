/**
 * Main application orchestrator
 */
import { PackageManager } from "./types";
export default class AppOrchestrator {
    /**
     * Main project creation function
     * @param repositoryUrl - Git repository URL
     * @param directoryName - Project directory name
     * @param includeHusky - Whether to include Husky
     * @param packageManager - Package manager to use (npm, yarn, bun)
     */
    static createProject(repositoryUrl: string, directoryName: string, includeHusky: boolean, packageManager?: PackageManager): Promise<void>;
    /**
     * Clones the template repository
     * @param repositoryUrl - Repository URL
     * @param tmpDir - Temporary directory name
     * @private
     */
    private static _cloneTemplate;
    /**
     * Gets dependencies from template package.json
     * @param tmpDir - Temporary directory
     * @returns Template dependencies
     * @private
     */
    private static _getTemplateDependencies;
    /**
     * Initializes React Native project
     * @param directoryName - Project directory name
     * @param packageManager - Package manager to use
     * @private
     */
    private static _initializeReactNativeProject;
    /**
     * Processes and installs dependencies
     * @param directoryName - Project directory
     * @param tempDependencies - Template dependencies
     * @param tempDevDependencies - Template dev dependencies
     * @param packageManager - Package manager to use
     * @private
     */
    private static _processDependencies;
    /**
     * Removes Husky from project
     * @param directoryName - Project directory
     * @param packageManager - Package manager to use
     * @private
     */
    private static _removeHusky;
    /**
     * Handles TypeScript specific files
     * @param tmpDir - Temporary directory
     * @param directoryName - Project directory
     * @private
     */
    private static _handleTypescriptFiles;
    /**
     * Moves Husky files from template
     * @param tmpDir - Temporary directory
     * @param directoryName - Project directory
     * @private
     */
    private static _moveHuskyFiles;
}
//# sourceMappingURL=AppOrchestrator.d.ts.map