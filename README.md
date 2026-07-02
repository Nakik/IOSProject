# iOS Apps - Expo React Native

A modern Expo React Native application built with TypeScript and Expo CLI.

## Features

- ⚡ **Expo Framework** - Simplified React Native development
- 📱 **Cross-Platform** - Build for iOS, Android, and Web
- 🎨 **TypeScript** - Full type safety
- 🧭 **React Navigation** - Smooth app navigation
- 📦 **Modular Structure** - Well-organized project layout

## Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS only) or Android Emulator for local testing

## Quick Start

### Installation

```bash
npm install
```

### Development

Start the Expo development server:

```bash
npm start
```

Run on specific platforms:

```bash
npm run ios       # iOS Simulator (macOS only)
npm run android   # Android Emulator
npm run web       # Web browser
```

### Project Structure

```
src/
├── App.tsx              # Main app component
├── screens/             # Screen components
├── components/          # Reusable components
├── navigation/          # Navigation configuration
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS Simulator (macOS)
- `npm run android` - Run on Android Emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Building

### Using Expo Go (Development)

Use the Expo Go app on your phone to test your app during development.

### Production Build

Create a production build using EAS Build:

```bash
# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Both platforms
eas build
```

## Configuration

- **app.json** - Expo app configuration (name, version, permissions, etc.)
- **babel.config.js** - Babel configuration for JSX/TypeScript transpiling
- **tsconfig.json** - TypeScript compiler options

## Customization

1. Update app branding in `app.json`
2. Add your screens to `src/screens/`
3. Configure navigation in `src/navigation/`
4. Create reusable components in `src/components/`

## Deployment

### Publish to Expo

```bash
# Login to Expo
expo login

# Publish
expo publish
```

### Build & Deploy

Use EAS Build and EAS Submit for App Store and Play Store deployment:

```bash
eas build
eas submit
```

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

## License

MIT
