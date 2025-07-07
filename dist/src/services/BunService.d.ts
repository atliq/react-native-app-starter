/**
 * Bun installation and management service
 */
export default class BunService {
    /**
     * Checks if Bun is installed
     * @returns True if Bun is installed
     */
    static isInstalled(): boolean;
    /**
     * Installs Bun based on the current platform
     * @returns True if installation was successful
     */
    static install(): boolean;
    /**
     * Adds Bun to the current session's PATH
     * @param platform - Current platform
     * @returns True if successfully added to PATH
     * @private
     */
    private static _addToPath;
    /**
     * Verifies that Bun installation was successful
     * @param platform - Current platform
     * @returns True if verification successful
     * @private
     */
    private static _verifyInstallation;
    /**
     * Ensures Bun is available for use
     * @returns True if Bun is available
     */
    static ensureAvailable(): boolean;
}
//# sourceMappingURL=BunService.d.ts.map