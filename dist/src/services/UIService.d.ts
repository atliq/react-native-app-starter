/**
 * User interface and interaction service
 */
export default class UIService {
    /**
     * Prompts user for project name
     * @returns Project name from user input
     */
    static promptForProjectName(): Promise<string>;
    /**
     * Prompts user for Husky installation preference
     * @returns True if user wants to install Husky
     */
    static promptForHusky(): Promise<boolean>;
    /**
     * Displays success message
     * @param directoryName - Project directory name
     */
    static displaySuccessMessage(directoryName: string): void;
    /**
     * Displays error message
     * @param message - Error message to display
     */
    static displayError(message: string): void;
}
//# sourceMappingURL=UIService.d.ts.map