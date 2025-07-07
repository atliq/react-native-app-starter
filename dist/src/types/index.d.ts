export interface ProjectOptions {
    repositoryUrl: string;
    directoryName: string;
    includeHusky: boolean;
    packageManager: PackageManager;
}
export type PackageManager = "npm" | "yarn" | "bun";
export interface RepositoryUrls {
    TYPESCRIPT: string;
}
export interface ValidationPatterns {
    INVALID_DIRECTORY: RegExp;
}
export interface Platforms {
    WINDOWS: string;
    UNIX: string[];
}
export interface BunInstallCommands {
    WINDOWS: string;
    UNIX: string;
}
export interface ErrorMessages {
    INVALID_DIRECTORY: string;
    BUN_INSTALL_FAILED: string;
}
export interface PackageJson {
    name?: string;
    version?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: any;
}
export interface UIPromptOptions {
    message: string;
    choices?: string[];
    default?: string | boolean;
}
//# sourceMappingURL=index.d.ts.map