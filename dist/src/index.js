"use strict";
/**
 * Main entry point for the React Native App Starter package
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageManagerService = exports.UIService = exports.ProjectService = exports.DependencyService = exports.BunService = exports.AppOrchestrator = void 0;
var AppOrchestrator_1 = require("./AppOrchestrator");
Object.defineProperty(exports, "AppOrchestrator", { enumerable: true, get: function () { return __importDefault(AppOrchestrator_1).default; } });
var BunService_1 = require("./services/BunService");
Object.defineProperty(exports, "BunService", { enumerable: true, get: function () { return __importDefault(BunService_1).default; } });
var DependencyService_1 = require("./services/DependencyService");
Object.defineProperty(exports, "DependencyService", { enumerable: true, get: function () { return __importDefault(DependencyService_1).default; } });
var ProjectService_1 = require("./services/ProjectService");
Object.defineProperty(exports, "ProjectService", { enumerable: true, get: function () { return __importDefault(ProjectService_1).default; } });
var UIService_1 = require("./services/UIService");
Object.defineProperty(exports, "UIService", { enumerable: true, get: function () { return __importDefault(UIService_1).default; } });
var PackageManagerService_1 = require("./services/PackageManagerService");
Object.defineProperty(exports, "PackageManagerService", { enumerable: true, get: function () { return __importDefault(PackageManagerService_1).default; } });
__exportStar(require("./config/constants"), exports);
__exportStar(require("./utils/fileSystem"), exports);
__exportStar(require("./utils/validation"), exports);
__exportStar(require("./utils/version"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map