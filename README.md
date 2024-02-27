# react-native-app-starter

This project is a [React Native](https://facebook.github.io/react-native/) boilerplate that can be used to kickstart a mobile application.

The boilerplate provides **an optimized architecture for building solid cross-platform mobile applications** through separation of concerns between the UI and business logic. It contains redux, saga, context, theme, localization, tabs and stack navigation.

<br/>

[![npm version](https://img.shields.io/npm/v/react-native-app-starter.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-app-starter)

## Getting Started

```
$ npx react-native-app-starter <ProjectName>

$ cd <ProjectName>

$ npx react-native run-ios

$ npx react-native run-android
```

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

