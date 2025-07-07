/**
 * Project setup and configuration service
 */
export default class ProjectService {
    /**
     * Adds custom scripts to package.json
     * @param directory - Project directory
     * @param includeHusky - Whether to include husky scripts
     */
    static addScripts(directory: string, includeHusky: boolean): void;
    /**
     * Modifies Android build.gradle file
     * @param directoryName - Project directory name
     */
    static modifyAndroidBuildGradle(directoryName: string): void;
    /**
     * Ensures tsconfig.json has compilerOptions
     * @param directoryName - Project directory name
     */
    static ensureTsconfigCompilerOptions(directoryName: string): void;
    /**
     * Copies project assets from template
     * @param tmpDir - Template directory
     * @param directoryName - Target directory
     */
    static copyProjectAssets(tmpDir: string, directoryName: string): void;
    /**
     * Sets up Husky hooks
     * @param directoryName - Project directory name
     */
    static setupHusky(directoryName: string): void;
    /**
     * Sets up .gitignore file
     * @param directoryName - Project directory name
     */
    static setupGitignore(directoryName: string): void;
    /**
     * Runs post-installation scripts
     * @param directoryName - Project directory name
     */
    static runPostInstallScripts(directoryName: string): void;
}
//# sourceMappingURL=ProjectService.d.ts.map