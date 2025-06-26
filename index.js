#! /usr/bin/env node

const fs = require("fs");
const os = require("os");
const shell = require("shelljs");

const { program } = require("commander");
const cliSelect = require("cli-select");

program.parse();

const programOptions = program.opts();

const checkAndInstallBun = () => {
  console.log("Checking if Bun is installed...");

  // Check if bun command is available
  const bunCheck = shell.exec("bun --version", { silent: true });

  if (bunCheck.code === 0) {
    console.log(
      `Bun is already installed (version: ${bunCheck.stdout.trim()})`
    );
    return true;
  } else {
    console.log("Bun is not installed. Installing Bun...");

    const platform = os.platform();
    let installResult;

    if (platform === "win32") {
      // Windows installation using PowerShell
      console.log("Detected Windows. Installing Bun using PowerShell...");
      installResult = shell.exec(
        'powershell -c "irm bun.sh/install.ps1 | iex"',
        { silent: false }
      );
    } else {
      // Unix-like systems (macOS, Linux)
      console.log(
        "Detected Unix-like system. Installing Bun using curl and bash..."
      );
      installResult = shell.exec("curl -fsSL https://bun.sh/install | bash", {
        silent: false,
      });
    }

    if (installResult.code === 0) {
      console.log("Bun installed successfully!");

      // Add bun to PATH for current session
      const homeDir = os.homedir();
      let bunPath;

      if (platform === "win32") {
        bunPath = `${homeDir}\\.bun\\bin`;
        process.env.PATH = `${bunPath};${process.env.PATH}`;
      } else {
        bunPath = `${homeDir}/.bun/bin`;
        process.env.PATH = `${bunPath}:${process.env.PATH}`;
      }

      // Verify installation
      const verifyResult = shell.exec("bun --version", { silent: true });
      if (verifyResult.code === 0) {
        console.log(
          `Bun verification successful (version: ${verifyResult.stdout.trim()})`
        );
        return true;
      } else {
        console.warn(
          "Bun was installed but verification failed. You may need to restart your terminal or reload your shell profile."
        );
        if (platform === "win32") {
          console.warn(
            "On Windows, you might need to restart your command prompt or PowerShell session."
          );
        }
        return false;
      }
    } else {
      console.error(
        `Failed to install Bun on ${platform}. Please install it manually from https://bun.sh`
      );
      if (platform === "win32") {
        console.error("For Windows, you can also try: npm install -g bun");
      }
      return false;
    }
  }
};

const main = async (repositoryUrl, directoryName, husky) => {
  console.log(`Creating new project ${directoryName}`);

  // Check and install Bun if needed
  const bunAvailable = checkAndInstallBun();
  if (!bunAvailable) {
    console.warn(
      "Continuing without Bun. Some features may not work as expected."
    );
  }

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

    const shellOptions = {
      cwd: `${process.cwd()}/${directoryName}`,
    };

    shell.exec(
      `echo N | npx @react-native-community/cli init ${directoryName} --pm bun`
    );
    shell.exec("bun install");

    //3. Installing the dependencies.
    console.log("installing... ", dependencyList);
    shell.exec(`bun add ${dependencyList.join(" ")}`, shellOptions);
    shell.exec(`bun add -D ${devDependencyList.join(" ")}`, shellOptions);

    if (!husky) {
      shell.exec(`bun remove husky`, shellOptions);
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
      shell.exec(`pod install --project-directory=ios`, {
        cwd: `${process.cwd()}/${directoryName}`,
      });
    } else {
      console.log("iOS setup only supported in Mac OS.");
    }

    if (husky) {
      shell.exec(`npx husky install`, shellOptions);
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
    shell.mv(`${tmpDir}/babel.config.js`, `${directoryName}`);
    shell.mv(`${tmpDir}/moduleResolver.js`, `${directoryName}`);
    shell.mv(`${tmpDir}/modules.json`, `${directoryName}`);
    shell.mv(`${tmpDir}/postinstall`, `${directoryName}`);
    shell.mv(`${tmpDir}/.prettierrc.js`, `${directoryName}`);
    shell.mv(`${tmpDir}/env.config`, `${directoryName}`);
    shell.mv(`${tmpDir}/react-native-config.d.ts`, `${directoryName}`);

    console.log("Adding additional scripts...");
    addScripts(directoryName, husky);

    console.log("Configuring Android build.gradle...");
    modifyAndroidBuildGradle(directoryName);

    if (husky) {
      console.log("Installing husky hooks");
      shell.exec("bun run prepare", shellOptions);
    }
    console.log("Setting up .gitignore");
    shell.exec(
      `echo "\n.env\n\!**/fastlane/.env" >> ${directoryName}/.gitignore`
    );

    console.log(`Application generated... its ready to use.
  To get started, 
  - cd ${directoryName}
  - bun run dev
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
    prepare: "husky init",
    "bundle-android":
      "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
    "bundle-ios":
      "npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle",
    "release-ios-changelog":
      "bun install && bun run generate-changelog && fastlane ios beta",
    "release-android-changelog":
      "bun install && bun run generate-changelog && fastlane android beta",
    "release-ios-changelog-bump":
      "bun install && bun run generate-changelog-bump && fastlane ios beta",
    "release-android-changelog-bump":
      "bun install && bun run generate-changelog-bump && fastlane android beta",
    "generate-changelog":
      'fastlane changelog build_changelog bump_type:"patch"',
    "generate-changelog-bump": "fastlane changelog build_changelog",
    "release-ios": "bun install && fastlane ios beta",
    "release-android": "bun install && fastlane android beta",
    release:
      "bun run generate-changelog && bun run release-android && bun run release-ios",
    "release-bump":
      "bun run generate-changelog-bump && bun run release-android && bun run release-ios",
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

const modifyAndroidBuildGradle = (directoryName) => {
  const buildGradlePath = `${directoryName}/android/app/build.gradle`;

  try {
    // Read the current build.gradle content
    const buildGradleContent = fs.readFileSync(buildGradlePath, "utf8");

    // Find the last "apply plugin" line and add our line after it
    const lines = buildGradleContent.split("\n");
    let lastApplyPluginIndex = -1;

    // Find the last occurrence of "apply plugin"
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("apply plugin")) {
        lastApplyPluginIndex = i;
      }
    }

    if (lastApplyPluginIndex !== -1) {
      // Insert the new line after the last "apply plugin" line
      lines.splice(
        lastApplyPluginIndex + 1,
        0,
        "apply from: project(':react-native-config').projectDir.getPath() + \"/dotenv.gradle\""
      );

      // Write the modified content back to the file
      fs.writeFileSync(buildGradlePath, lines.join("\n"));
      console.log(
        "Added react-native-config dotenv.gradle to android/app/build.gradle"
      );
    } else {
      console.warn(
        "Could not find 'apply plugin' lines in android/app/build.gradle"
      );
    }
  } catch (error) {
    console.error(`Error modifying android/app/build.gradle: ${error.message}`);
  }
};

const tsURL = "https://github.com/rutvik24/react-native-boilerplate-ts.git";

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

