# react-native-app-starter

This project is a [React Native](https://facebook.github.io/react-native/) boilerplate that can be used to kickstart a mobile application.

The boilerplate provides **an optimized architecture for building solid cross-platform mobile applications** through separation of concerns between the UI and business logic. It contains redux, saga, context, theme, localization, tabs and stack navigation.

#### Quick start

```
$ npx react-native-app-starter <ProjectName>

$ cd <ProjectName>

$ npx react-native run-ios

$ npx react-native run-android
```

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

## Preconfigured with

- Latest react native version

- Redux saga with persistReducer

- Localization

- Theme support (Dark / Light)

- Utility for validations and error messages

- Custom font and font size for maintain typography

- .env setup

- Support different env for PRODUCTION and DEVELOPMENT

- User Authemntication flow

- UI for Login, Tabs and Settings

- Fastlane setup

## Predefined UI

<br>
<p align="center">
  <img alt="Image Capture" src="https://iili.io/H1D2Q6v.png" width="25%"
  >
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Image Capture" src="https://iili.io/H1DFNrx.png" width="25%"
  >
  &nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Image Capture" src="https://iili.io/H1DKr92.png" width="25%"
  >
</p>
<br>
