#! /usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { program } = require("commander");
const cliSelect = require("cli-select");

program.option("--ts").option("--js");

program.parse();

const programOptions = program.opts();

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

const main = async (repositoryUrl, directoryName, husky) => {
  console.log(`Creating new project ${directoryName}`);
  if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.error(`
        Invalid directory name.
        Usage : '@atliq/react-native-starter name_of_app'
        `);
  }
  //Get the name of the app-directory to make
  let tmpDir;
  const appPrefix = "reactStarter";
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    //1. Clone the repository into the given name
    await runCommand("git", ["clone", repositoryUrl, tmpDir]);

    //2. get the json from package.json
    const packageJsonRaw = fs.readFileSync(`${tmpDir}/package.json`);
    const packageJson = JSON.parse(packageJsonRaw);
    const dependencyList = Object.keys(packageJson.dependencies);
    const devDependencyList = Object.keys(packageJson.devDependencies);

    console.log("Now, installing react-native...");
    if (
      repositoryUrl ===
      "https://github.com/atliq/react-native-boilerplate-ts.git"
    ) {
      await runCommand("npx", [
        "react-native",
        "init",
        directoryName,
        "--template",
        "react-native-template-typescript",
      ]);
    } else {
      await runCommand("npx", ["react-native", "init", directoryName]);
    }

    //3. Installing the dependencies.
    console.log("installing... ", dependencyList);
    await runCommand("yarn", ["add", ...dependencyList], {
      cwd: `${process.cwd()}/${directoryName}`,
    });

    await runCommand("yarn", ["add", "--dev", ...devDependencyList], {
      cwd: `${process.cwd()}/${directoryName}`,
    });

    if (!husky) {
      await runCommand("yarn", ["remove", "--dev", "husky"], {
        cwd: `${process.cwd()}/${directoryName}`,
      });
    }
    const projectDirectories = directoryName.split("/");
    await runCommand("find", [
      `${tmpDir}/android/app/src/main/res/drawable/`,
      "-type",
      "f",
      "-name",
      "*.png",
      "-exec",
      "cp",
      "{}",
      `${directoryName}/android/app/src/main/res/drawable/`,
      ";",
    ]);
    await runCommand("find", [
      `${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/`,
      "-type",
      "d",
      "-name",
      "*.imageset",
      "-exec",
      "cp",
      "-R",
      "{}",
      `${directoryName}/ios/${
        projectDirectories[projectDirectories.length - 1]
      }/Images.xcassets/`,
      ";",
    ]);
    await runCommand("mv", [`${tmpDir}/App`, `${directoryName}`]);
    await runCommand("mv", [`${tmpDir}/.env`, `${directoryName}`]);
    await runCommand("mv", [`${tmpDir}/fastlane`, `${directoryName}`]);

    if (os.type() === "Darwin") {
      await runCommand("npx", ["pod-install"], {
        cwd: `${process.cwd()}/${directoryName}`,
      });
    } else {
      console.log("iOS setup only supported in Mac OS.");
    }

    if (husky) {
      await runCommand("yarn", ["run", "husky", "install"]);
      await runCommand("rm", ["-rf", `${directoryName}/.husky`]);
      await runCommand("mv", [`${tmpDir}/.husky`, `${directoryName}`]);
    }

    if (
      repositoryUrl ===
      "https://github.com/atliq/react-native-boilerplate-ts.git"
    ) {
      await runCommand("rm", ["-rf", `${directoryName}/index.js`]);
      await runCommand("mv", [`${tmpDir}/index.js`, `${directoryName}`]);
      await runCommand("rm", ["-rf", `${directoryName}/App.tsx`]);
    } else {
      await runCommand("rm", ["-rf", `${directoryName}/App.js`]);
    }
    await runCommand("rm", ["-rf", `${directoryName}/babel.config.js`]);
    await runCommand("rm", ["-rf", `${directoryName}/tsconfig.json`]);
    await runCommand("mv", [`${tmpDir}/babel.config.js`, `${directoryName}`]);
    await runCommand("mv", [`${tmpDir}/tsconfig.json`, `${directoryName}`]);
    await runCommand("mv", [`${tmpDir}/modules.json`, `${directoryName}`]);

    console.log(`Application generated... its ready to use.
  To get started, 
  - cd ${directoryName}
  - npm run dev
  `);
    // - If not start try to delete watchman watches by running following command:
    // - watchman watch-del-all
    // - Then start metro server clearing its cache by running following command:
    // - yarn start --clear-cache

    // the rest of your app goes here
  } catch {
    // handle error
  } finally {
    try {
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    } catch (e) {
      console.error(
        `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
      );
    }
  }
};

const tsURL = "https://github.com/atliq/react-native-boilerplate-ts.git";
const jsURL = "https://github.com/atliq/react-native-boilerplate.git";

let directoryName = process.argv[2];

if (process.argv[2] === "--ts" || process.argv[2] === "--js") {
  directoryName = "";
}

if (!directoryName || directoryName.length === 0) {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(`What's your project name?`, (name) => {
    console.log(`Hi ${name}!`);
    readline.close();
    directoryName = name;
    cliSelect({
      values: ["TypeScript", "Javascript"],
    }).then((value) => {
      console.log(value);
      console.log(`Generating... ${value.value} Template`);
      console.log(`Do you want to install husky`);
      cliSelect({
        values: ["Yes", "No"],
      }).then((husky) => {
        console.log(value);
        if (husky.value === "Yes") {
          if (value.value === "TypeScript") {
            main(tsURL, directoryName, true);
          } else {
            main(jsURL, directoryName, true);
          }
        } else {
          if (value.value === "TypeScript") {
            main(tsURL, directoryName, false);
          } else {
            main(jsURL, directoryName, false);
          }
        }
      });
    });
    if (programOptions.ts) {
      console.log("Generating... Typescript Template");
      return main(tsURL, directoryName);
    }

    if (programOptions.js) {
      console.log("Generating... JS Template");
      return main(jsURL, directoryName);
    }
  });
  return;
}

if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.error(`
      Invalid directory name.
      Usage : '@atliq/react-native-starter name_of_app'
      `);
}

if (programOptions.ts) {
  console.log("Generating... Typescript Template");
  return main(tsURL, directoryName);
}

if (programOptions.js) {
  console.log("Generating... JS Template");
  return main(jsURL, directoryName);
}

cliSelect({
  values: ["TypeScript", "Javascript"],
}).then((value) => {
  console.log(value);
  console.log(`Generating... ${value.value} Template`);
  console.log(`Do you want to install husky`);
  cliSelect({
    values: ["Yes", "No"],
  }).then((husky) => {
    console.log(value);
    if (husky.value === "Yes") {
      if (value.value === "TypeScript") {
        main(tsURL, directoryName, true);
      } else {
        main(jsURL, directoryName, true);
      }
    } else {
      if (value.value === "TypeScript") {
        main(tsURL, directoryName, false);
      } else {
        main(jsURL, directoryName, false);
      }
    }
  });
});
