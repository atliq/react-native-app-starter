#! /usr/bin/env node

const fs = require("fs");
const os = require("os");
const shell = require("shelljs");

const { program } = require("commander");
const cliSelect = require("cli-select");

program.parse();

const programOptions = program.opts();

const main = async (repositoryUrl, directoryName, husky) => {
  console.log(`Creating new project ${directoryName}`);
  console.log(`Installing Yarn`);
  shell.exec("npm install -g yarn", (code, stdout, stderr) => {
    console.log(stdout);
  });
  if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.error(`
        Invalid directory name.
        Usage : '@atliq/react-native-starter name_of_app'
        `);
  }
  //Get the name of the app-directory to make
  let tmpDir = "temp";
  try {
    shell.mkdir("temp");

    shell.exec(`git clone ${repositoryUrl} ${tmpDir}`);

    //2. get the json from package.json
    const packageJsonRaw = fs.readFileSync(`${tmpDir}/package.json`);

    const packageJson = JSON.parse(packageJsonRaw);
    const dependencyList = Object.keys(packageJson.dependencies);
    const devDependencyList = Object.keys(packageJson.devDependencies);

    console.log("Now, installing react-native...");

    shell.exec(`npx react-native init ${directoryName}`);


    //3. Installing the dependencies.
    console.log("installing... ", dependencyList);
    shell.exec(`yarn add ${dependencyList.join(" ")}`, {
      cwd: `${process.cwd()}/${directoryName}`,
    });
    shell.exec(`yarn add --dev ${devDependencyList.join(" ")}`, {
      cwd: `${process.cwd()}/${directoryName}`,
    });

    if (!husky) {
      shell.exec(`yarn remove --dev husky`, {
        cwd: `${process.cwd()}/${directoryName}`,
      });
    }
    const projectDirectories = directoryName.split("/");

    shell.ls(`${tmpDir}/android/app/src/main/res/drawable/`).forEach((file) => {
      shell.cp(
        "-rf",
        `${tmpDir}/android/app/src/main/res/drawable/${file}`,
        `${directoryName}/android/app/src/main/res/drawable/`
      );
    });
    shell
      .ls(`${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/`)
      .forEach((file) => {
        shell.cp(
          "-rf",
          `${tmpDir}/ios/boilerPlateTypescript/Images.xcassets/${file}`,
          `${directoryName}/ios/${projectDirectories[projectDirectories.length - 1]
          }/Images.xcassets/`
        );
      });
    shell.mv(`${tmpDir}/App`, `${directoryName}`);
    shell.mv(`${tmpDir}/.env`, `${directoryName}`);
    shell.mv(`${tmpDir}/fastlane`, `${directoryName}`);

    if (os.type() === "Darwin") {
      shell.exec(`npx pod-install`, {
        cwd: `${process.cwd()}/${directoryName}`,
      });
    } else {
      console.log("iOS setup only supported in Mac OS.");
    }

    if (husky) {
      shell.exec(`npx husky install`);
      shell.rm("-rf", `${directoryName}/.husky`);
      shell.mv(`${tmpDir}/.husky`, `${directoryName}`);
    }

    if (
      repositoryUrl ===
      "https://github.com/atliq/react-native-boilerplate-ts.git"
    ) {
      shell.rm("-rf", `${directoryName}/index.js`);
      shell.mv(`${tmpDir}/index.js`, `${directoryName}`);
      shell.rm("-rf", `${directoryName}/App.tsx`);
    } else {
      shell.rm("-rf", `${directoryName}/App.js`);
    }
    shell.rm("-rf", `${directoryName}/babel.config.js`);
    shell.rm("-rf", `${directoryName}/tsconfig.json`);
    shell.mv(`${tmpDir}/babel.config.js`, `${directoryName}`);
    shell.mv(`${tmpDir}/tsconfig.json`, `${directoryName}`);
    shell.mv(`${tmpDir}/moduleResolver.js`, `${directoryName}`);
    shell.mv(`${tmpDir}/modules.json`, `${directoryName}`);
    shell.mv(`${tmpDir}/postinstall`, `${directoryName}`);
    shell.mv(`${tmpDir}/.prettierrc.js`, `${directoryName}`);

    console.log(`Application generated... its ready to use.
  To get started, 
  - cd ${directoryName}
  - npm run dev
  `);

    console.log("Please, add \"postinstall\": \"sh postinstall\" in script to package.json ");

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

let directoryName = process.argv[2];


if (!directoryName || directoryName.length === 0) {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(`What's your project name?`, (name) => {
    console.log(`Hi ${name}!`);
    readline.close();
    directoryName = name;

    console.log(`Do you want to install husky`);
    cliSelect({
      values: ["Yes", "No"],
    }).then((husky) => {
      console.log(husky);
      if (husky.value === "Yes") {
        main(tsURL, directoryName, true);
      } else {
        main(tsURL, directoryName, false);
      }
    });
    if (programOptions.ts) {
      console.log("Generating... Typescript Template");
      return main(tsURL, directoryName);
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

console.log(`Do you want to install husky`);

cliSelect({
  values: ["Yes", "No"],
}).then((husky) => {
  console.log(husky);
  if (husky.value === "Yes") {
    main(tsURL, directoryName, true);
  } else {
    main(tsURL, directoryName, false);
  }
});

