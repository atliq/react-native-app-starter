#!/usr/bin/env node

/**
 * Development script to build and run the CLI with arguments forwarding
 */

const { spawn } = require("child_process");
const { execSync } = require("child_process");

// Build the project first
console.log("Building project...");
try {
  execSync("npm run build", { stdio: "inherit" });
} catch (error) {
  console.error("Build failed");
  process.exit(1);
}

// Get all arguments after 'node dev.js'
const args = process.argv.slice(2);

// Run the built CLI with forwarded arguments
const child = spawn("node", ["dist/index.js", ...args], {
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code);
});

child.on("error", (error) => {
  console.error("Error running CLI:", error);
  process.exit(1);
});

