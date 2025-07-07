"use strict";
/**
 * Example test file demonstrating how to test the modular structure
 * This is a basic example - you would typically use a testing framework like Jest
 */
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("./src/utils/version");
const validation_1 = require("./src/utils/validation");
// Simple test function
function test(description, testFn) {
    try {
        testFn();
        console.log(`✅ ${description}`);
    }
    catch (error) {
        console.log(`❌ ${description}: ${error.message}`);
    }
}
// Test version utilities
test("compareVersions should handle semantic versions", () => {
    const result = (0, version_1.compareVersions)("1.0.0", "1.0.1");
    if (result !== -1)
        throw new Error(`Expected -1, got ${result}`);
});
test("compareVersions should handle equal versions", () => {
    const result = (0, version_1.compareVersions)("1.0.0", "1.0.0");
    if (result !== 0)
        throw new Error(`Expected 0, got ${result}`);
});
test("isStaticVersion should identify static versions", () => {
    if (!(0, version_1.isStaticVersion)("1.0.0"))
        throw new Error("Should be static");
    if ((0, version_1.isStaticVersion)("^1.0.0"))
        throw new Error("Should not be static");
});
// Test validation utilities
test("isValidDirectoryName should reject invalid names", () => {
    if ((0, validation_1.isValidDirectoryName)("test<>"))
        throw new Error("Should be invalid");
    if (!(0, validation_1.isValidDirectoryName)("test-app"))
        throw new Error("Should be valid");
});
test("randomNameGenerator should generate strings of correct length", () => {
    const result = (0, validation_1.randomNameGenerator)(5);
    if (result.length !== 5)
        throw new Error(`Expected length 5, got ${result.length}`);
});
console.log("\nAll tests completed!");
console.log("\nTo run with a proper testing framework:");
console.log("1. Install Jest: npm install --save-dev jest");
console.log("2. Add test script to package.json");
console.log("3. Create proper test files in __tests__ directory");
//# sourceMappingURL=example-tests.js.map