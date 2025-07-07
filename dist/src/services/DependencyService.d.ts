/**
 * Dependency management service
 */
import { PackageManager } from "../types";
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
    static processDependenciesWithVersionCheck(directoryName: string, tempDependencies: Record<string, string>, tempDevDependencies: Record<string, string>): Promise<DependencyProcessResult>;
    /**
     * Determines if a dependency should be installed/updated
     * @param depName - Dependency name
     * @param tempVersion - Version from template
     * @param existingVersion - Existing version in project
     * @param depType - Type of dependency (for logging)
     * @returns Package string to install or null if no action needed
     * @private
     */
    private static _shouldInstallDependency;
    /**
     * Installs dependencies using specified package manager
     * @param directoryName - Project directory
     * @param dependencies - Regular dependencies to install
     * @param devDependencies - Dev dependencies to install
     * @param shell - Shell instance for executing commands
     * @param packageManager - Package manager to use
     */
    static installDependencies(directoryName: string, dependencies: string[], devDependencies: string[], shell: typeof import("shelljs"), packageManager?: PackageManager): void;
    /**
     * Fallback installation of all dependencies from template
     * @param directoryName - Project directory
     * @param tempDependencies - Dependencies from template
     * @param tempDevDependencies - Dev dependencies from template
     * @param shell - Shell instance for executing commands
     * @param packageManager - Package manager to use
     */
    static fallbackInstallation(directoryName: string, tempDependencies: Record<string, string>, tempDevDependencies: Record<string, string>, shell: typeof import("shelljs"), packageManager?: PackageManager): void;
}
export {};
//# sourceMappingURL=DependencyService.d.ts.map