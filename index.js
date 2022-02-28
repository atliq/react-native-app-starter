#! /usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require('path');

const { program } = require('commander');
const cliSelect = require('cli-select');


program
  .option('--ts')
  .option('--js');

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

const main = async (repositoryUrl, directoryName) => {
  console.log(`Creating new project ${directoryName}`);
  if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.error(`
        Invalid directory name.
        Usage : '@atliq/react-native-starter name_of_app'
        `);
  }
  //Get the name of the app-directory to make
  let tmpDir;
  const appPrefix = 'reactStarter';
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    //1. Clone the repository into the given name
    await runCommand("git", ["clone", repositoryUrl, tmpDir]);

    //2. get the json from package.json
    const packageJsonRaw = fs.readFileSync(`${tmpDir}/package.json`);
    const packageJson = JSON.parse(packageJsonRaw);
    const dependencyList = Object.keys(packageJson.dependencies);

    console.log("Now, installing react-native...");
    await runCommand("npx", ["react-native", "init", directoryName]);

    //3. Installing the dependencies.
    console.log("installing... ", dependencyList);
    await runCommand("yarn", ["add", ...dependencyList], {
      cwd: `${process.cwd()}/${directoryName}`,
    });

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
    await runCommand("rm", ["-rf", `${directoryName}/App.js`]);

    console.log(`Application generated... its ready to use.
  To get started, 
  - cd ${directoryName}
  - npm run dev
    `);
    // the rest of your app goes here
  }
  catch {
    // handle error
  }
  finally {
    try {
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    }
    catch (e) {
      console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
    }
  }
 
};



const tsURL = "https://github.com/atliq/react-native-boilerplate-ts.git";
const jsURL = "https://github.com/atliq/react-native-boilerplate.git";

let directoryName = process.argv[2];

if(process.argv[2] === '--ts' || process.argv[2] === '--js'){
  directoryName = ''
}

if(!directoryName || directoryName.length === 0){
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`What's your project name?`, name => {
    console.log(`Hi ${name}!`)
    readline.close()
    directoryName = name;
    if(programOptions.ts) {
      console.log("Generating... Typescript Template");
      return main(tsURL, directoryName);
    }

    if(programOptions.js) {
      console.log("Generating... JS Template");
      return main(jsURL, directoryName);
    }

  })
  return;
}

if (directoryName.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.error(`
      Invalid directory name.
      Usage : '@atliq/react-native-starter name_of_app'
      `);
}


if(programOptions.ts) {
  console.log("Generating... Typescript Template");
  return main(tsURL, directoryName);
}

if(programOptions.js) {
  console.log("Generating... JS Template");
  return main(jsURL, directoryName);
}



cliSelect({
  values: ['TypeScript', 'Javascript'],
}).then(value => {
  console.log(value);
  console.log(`Generating... ${value.value} Template`);
  if(value.value === 'TypeScript') {
    main(tsURL, directoryName);
  } else {
    main(jsURL, directoryName);
  }
});

