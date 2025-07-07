# react-native-app-starter

This project is a [React Native](https://facebook.github.io/react-native/) boilerplate that can be used to kickstart a mobile application.

The boilerplate provides **an optimized architecture for building solid cross-platform mobile applications** through separation of concerns between the UI and business logic. It contains redux, saga, context, theme, localization, tabs and stack navigation.

<br/>

[![npm version](https://img.shields.io/npm/v/react-native-app-starter.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-app-starter)

## Getting Started

Creates a new React Native project with TypeScript template:

```bash
# Using npx with default package manager (bun)
$ npx react-native-app-starter <ProjectName>

# Using bunx with default package manager (bun)
$ bunx react-native-app-starter <ProjectName>

# Specifying a different package manager
$ npx react-native-app-starter <ProjectName> --pm yarn
$ npx react-native-app-starter <ProjectName> --pm npm

$ cd <ProjectName>

$ npx react-native run-ios

$ npx react-native run-android
```

### Package Manager Options

The CLI supports three package managers:

- **bun** (default) - Automatically installed if not present
- **yarn** - Prompts for installation if not present
- **npm** - Should be available with Node.js installation

<br/>

## Directory Structure

```
root
├── __tests__
├── android
├── ios
└── App
    └── Actions
    |   ├── Keys
    └── ApiConfig
    └── AppContext
    └── Localization
    └── Reducers
    |   ├──Default
    └── Routes
    └── Sagas
    └── Screens
    |    CommonComponent
    |    Components
    |    SubComponents
    └── Services
    └── Stores
    └── Theme
    |    Images
    └── Utils
├── fastlane
├── .env
...
```

<br/>

## Preconfigured with

- Latest react native version

- Redux saga with persistReducer

- Localization

- Theme support (Dark / Light)

- Utility for validations and error messages

- Custom font and font size for maintain typography

- .env and fastlane setup

- Support different env for PRODUCTION and DEVELOPMENT

- User Authemntication flow

- UI for Login, Tabs and Settings

<br/>

## Predefined UI

<details open>
  <summary>Expand for screenshots</summary>
<table>
  <tr><td colspan=2><strong>iOS</strong></td></tr>
  <tr>
    <td><p align="center"><img src="https://iili.io/H1D2Q6v.png" width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/JAd7gzg.md.png"  width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/JAd7SmF.md.png" width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/HEH6Q2t.png" width="200" height="400"/></p></td>
  </tr>
  <tr><td colspan=2><strong>Android</strong></td></tr>
  <tr>
    <td><p align="center"><img src="https://iili.io/HEJxT8B.png" width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/JAdYzEx.md.png"  width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/JAdYIrQ.md.png" width="200" height="400"/></p></td>
    <td><p align="center"><img src="https://iili.io/HEJxgA7.png" width="200" height="400"/></p></td>
  </tr>  
  </tr>
</table>
</details>

## Development

This CLI tool is built with TypeScript and provides a modular architecture for easy maintenance and testing.

### Project Structure

```
├── src/
│   ├── config/           # Configuration constants
│   ├── services/         # Business logic services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Main exports
├── dist/                # Compiled JavaScript output
├── index.ts            # CLI entry point
└── tsconfig.json       # TypeScript configuration
```

### Available Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run the CLI tool
- `npm run test:modules` - Run example tests
- `npm run clean` - Remove compiled output

### Building from Source

```bash
# Clone the repository
git clone <repo-url>
cd react-native-app-starter

# Install dependencies
npm install

# Build the project
npm run build

# Test the CLI
node dist/index.js --help
```

### Running with npx/bunx

After publishing, the package can be used with:

```bash
# Using npx
npx react-native-app-starter my-app

# Using bunx
bunx react-native-app-starter my-app
```

