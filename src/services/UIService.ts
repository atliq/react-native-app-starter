/**
 * User interface and interaction service
 */

import * as readline from "readline";
import cliSelect from "cli-select";

export default class UIService {
  /**
   * Prompts user for project name
   * @returns Project name from user input
   */
  static async promptForProjectName(): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question("What's your project name? ", (name) => {
        console.log(`Hi ${name}!`);
        rl.close();
        resolve(name);
      });
    });
  }

  /**
   * Prompts user for Husky installation preference
   * @returns True if user wants to install Husky
   */
  static async promptForHusky(): Promise<boolean> {
    console.log("Do you want to install husky?");

    const result = await cliSelect({
      values: ["Yes", "No"],
    });

    console.log(result);
    return result.value === "Yes";
  }

  /**
   * Displays success message
   * @param directoryName - Project directory name
   */
  static displaySuccessMessage(directoryName: string): void {
    console.log(`Application generated... it's ready to use.
  To get started, 
  - cd ${directoryName}
  - bun run android
  `);
  }

  /**
   * Displays error message
   * @param message - Error message to display
   */
  static displayError(message: string): void {
    console.error(message);
  }
}

