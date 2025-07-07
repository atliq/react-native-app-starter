"use strict";
/**
 * User interface and interaction service
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
const readline = __importStar(require("readline"));
const cli_select_1 = __importDefault(require("cli-select"));
class UIService {
    /**
     * Prompts user for project name
     * @returns Project name from user input
     */
    static async promptForProjectName() {
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
    static async promptForHusky() {
        console.log("Do you want to install husky?");
        const result = await (0, cli_select_1.default)({
            values: ["Yes", "No"],
        });
        console.log(result);
        return result.value === "Yes";
    }
    /**
     * Displays success message
     * @param directoryName - Project directory name
     */
    static displaySuccessMessage(directoryName) {
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
    static displayError(message) {
        console.error(message);
    }
}
exports.default = UIService;
//# sourceMappingURL=UIService.js.map