#! /usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    spawned.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}

const main = async (repositoryUrl) => {
  //Get the name of the app-directory to make
  const directoryName = process.argv[2];
  if (!directoryName || directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.log(`
        Invalid directory name.
        Usage : '@atliq/react-native-starter name_of_app'
        `);
  }
  //1. Clone the repository into the given name
  await runCommand("git", ["clone", repositoryUrl, "reactStarter"]);

  //2. get the json from package.json
  const packageJsonRaw = fs.readFileSync(`reactStarter/package.json`);
  const packageJson = JSON.parse(packageJsonRaw);
  const dependencyList = Object.keys(packageJson.dependencies);

  console.log("Now, installing react-native...");
  await runCommand("npx", ["react-native", "init", directoryName]);

  //3. Installing the dependencies.
  console.log("installing... ", dependencyList);
  await runCommand("yarn", ["add", ...dependencyList], {
    cwd: `${process.cwd()}/${directoryName}`,
  });

  await runCommand("mv", [`reactStarter/App`, `${directoryName}`]);
  await runCommand("mv", [`reactStarter/.env`, `${directoryName}`]);
  await runCommand("mv", [`reactStarter/fastlane`, `${directoryName}`]);

  await runCommand("rm", ["-rf", `${directoryName}/App.js`]);
  await runCommand("npx", ["pod-install"], {
    cwd: `${process.cwd()}/${directoryName}`,
  });
  await runCommand("rm", ["-rf", `reactStarter`]);

  console.log(`Application generated is ready to use.
To get started, 
- cd ${directoryName}
- npm run dev
  `);
};

return main("https://github.com/atliq/react-native-boilerplate.git");
