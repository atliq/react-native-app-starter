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
  shell.exec("yarn add -g yarn", (code, stdout, stderr) => {
    console.log(stdout);
  });
  if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.error(`
        Invalid directory name.
        Usage : 'npx react-native-app-starter name_of_app'
        `);
  }

  const randomNameGenerator = (num) => {
    let res = "";
    for (let i = 0; i < num; i++) {
      const random = Math.floor(Math.random() * 27);
      res += String.fromCharCode(97 + random);
    }
    return res;
  };

  //Get the name of the app-directory to make
  let tmpDir = "temp" + randomNameGenerator(5);
  try {
    shell.exec(`git clone ${repositoryUrl} ${tmpDir}`);

    //2. get the json from package.json
    const packageJsonRaw = fs.readFileSync(`${tmpDir}/package.json`);

    const packageJson = JSON.parse(packageJsonRaw);
    const dependencyList = Object.keys(packageJson.dependencies);
    const devDependencyList = Object.keys(packageJson.devDependencies);

    console.log("Now, installing react-native...");

    shell.exec(`echo N | npx react-native init ${directoryName}`);
    //3. Installing the dependencies.
    console.log("installing... ", dependencyList);
    shell.exec(`yarn add ${dependencyList.join(" ")}`, {
      cwd: `${process.cwd()}/${directoryName}`,
    });
    shell.exec(`yarn add -D ${devDependencyList.join(" ")}`, {
      cwd: `${process.cwd()}/${directoryName}`,
    });

    if (!husky) {
      shell.exec(`yarn remove husky`, {
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
          `${directoryName}/ios/${
            projectDirectories[projectDirectories.length - 1]
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

    if (repositoryUrl === tsURL) {
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
    shell.mv(`${tmpDir}/env.config`, `${directoryName}`);

    console.log("Adding additional scripts...");
    addScripts(directoryName, husky);
    if (husky) {
      console.log("Installing husky hooks");
      shell.exec("yarn", "prepare");
    }
    console.log("Setting up .gitignore");
    shell.exec(
      `echo "\n.env\n\!**/fastlane/.env" >> ${directoryName}/.gitignore`
    );

    console.log(`Application generated... its ready to use.
  To get started, 
  - cd ${directoryName}
  - npm run dev
  `);

    // console.log(
    //   'Please, add "postinstall": "sh postinstall" in script to package.json '
    // );

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

const addScripts = (directory, husky) => {
  let packageJSON = JSON.parse(
    fs.readFileSync(`${directory}/package.json`, "utf8")
  );
  let scripts = packageJSON.scripts;
  scripts = {
    ...scripts,
    postinstall: "sh postinstall",
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
    prepare: "husky install",
    "bundle-android":
      "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
    "bundle-ios":
      "npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle",
    "release-ios-changelog":
      "yarn install && yarn run generate-changelog && fastlane ios beta",
    "release-android-changelog":
      "yarn install && yarn run generate-changelog && fastlane android beta",
    "release-ios-changelog-bump":
      "yarn install && yarn run generate-changelog-bump && fastlane ios beta",
    "release-android-changelog-bump":
      "yarn install && yarn run generate-changelog-bump && fastlane android beta",
    "generate-changelog":
      'fastlane changelog build_changelog bump_type:"patch"',
    "generate-changelog-bump": "fastlane changelog build_changelog",
    "release-ios": "yarn install && fastlane ios beta",
    "release-android": "yarn install && fastlane android beta",
    release:
      "yarn run generate-changelog && yarn run release-android && yarn run release-ios",
    "release-bump":
      "yarn run generate-changelog-bump && yarn run release-android && yarn run release-ios",
  };
  if (!husky) {
    delete scripts.prepare;
  }
  packageJSON.scripts = scripts;
  fs.writeFileSync(
    `${directory}/package.json`,
    JSON.stringify(packageJSON, null, 2)
  );
  console.log("Added scripts to package.json");
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

