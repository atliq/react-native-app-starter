/**
 * Package manager installation and management service
 */
import { PackageManager } from "../types";
export default class PackageManagerService {
    /**
     * Checks if a package manager is installed
     * @param packageManager - Package manager to check
     * @returns True if package manager is installed
     */
    static isInstalled(packageManager: PackageManager): boolean;
    /**
     * Installs a package manager
     * @param packageManager - Package manager to install
     * @returns True if installation was successful
     */
    static install(packageManager: PackageManager): Promise<boolean>;
    /**
     * Ensures a package manager is available for use
     * @param packageManager - Package manager to ensure
     * @returns True if package manager is available
     */
    static ensureAvailable(packageManager: PackageManager): Promise<boolean>;
    /**
     * Gets the appropriate command for the package manager
     * @param packageManager - Package manager
     * @param action - Action to perform (install, add, remove, etc.)
     * @returns Command string
     */
    static getCommand(packageManager: PackageManager, action: string): string;
    /**
     * Installs Bun (without asking permission)
     * @param platform - Current platform
     * @returns True if installation was successful
     * @private
     */
    private static _installBun;
    /**
     * Installs Yarn
     * @param platform - Current platform
     * @returns True if installation was successful
     * @private
     */
    private static _installYarn;
    /**
     * Asks user permission to install a package manager
     * @param packageManagerName - Display name of package manager
     * @returns True if user gave permission
     * @private
     */
    private static _askPermissionToInstall;
    /**
     * Adds package manager to the current session's PATH
     * @param platform - Current platform
     * @param packageManager - Package manager name
     * @returns True if successfully added to PATH
     * @private
     */
    private static _addToPath;
    /**
     * Verifies that package manager installation was successful
     * @param packageManager - Package manager to verify
     * @param platform - Current platform
     * @returns True if verification successful
     * @private
     */
    private static _verifyInstallation;
}
//# sourceMappingURL=PackageManagerService.d.ts.map