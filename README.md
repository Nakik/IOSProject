# iOS Apps

Expo React Native app with TypeScript, push notification setup, and Codemagic CI/CD workflows for GitHub.

## Local Development

```bash
npm ci
npm start
```

Run a platform target:

```bash
npm run ios
npm run android
npm run web
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run ci
```

## Codemagic CI/CD

The repository includes `codemagic.yaml` with three workflows:

- `expo-quality`: runs TypeScript and ESLint checks on pull requests.
- `expo-android-release`: generates the Android project with Expo prebuild, signs it, builds an `.aab`, and can publish to Google Play internal testing.
- `expo-ios-release`: generates the iOS project with Expo prebuild, signs it, builds an `.ipa`, and can submit to TestFlight.

Codemagic expects `codemagic.yaml` in the repository root. Commit this repository to GitHub, add it in Codemagic, and scan the selected branch for the YAML configuration.

### Required Codemagic Setup

Create these values in Codemagic before running release workflows:

1. Android signing identity
   - Upload your Android keystore in Team settings > Codemagic.yaml settings > Code signing identities.
   - Set the keystore reference name to `ios_apps_upload_keystore`.

2. Google Play environment group
   - Create an environment group named `google_play`.
   - Add secret variable `GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS` containing the full Google Play service account JSON.
   - Add `BUILD_NOTIFICATION_EMAIL` with the email address that should receive build results.

3. App Store Connect integration
   - Create a Codemagic App Store Connect integration named `Codemagic`.
   - Create an environment group named `app_store_connect`.
   - Add `BUILD_NOTIFICATION_EMAIL`.
   - Set `APP_STORE_APP_ID` in `codemagic.yaml` if you want to use App Store build-number lookup later.

4. Apple signing
   - Make sure the Apple bundle identifier exists: `com.iosapps.app`.
   - Allow Codemagic automatic signing for App Store distribution, or upload the required certificate and provisioning profile in Codemagic.

## App Identity

Current app identifiers:

- iOS bundle identifier: `com.iosapps.app`
- Android package name: `com.iosapps.app`
- Expo slug: `ios-apps`

Change these in `app.json` and `codemagic.yaml` before your first store release if you want a different production identity. Store identifiers become hard to change after release.

## Build Versioning

Codemagic runs `scripts/set-codemagic-build-version.js` before `expo prebuild`. It writes the Codemagic build number into:

- `expo.ios.buildNumber`
- `expo.android.versionCode`

This keeps App Store Connect and Google Play uploads from reusing build number `1`.

## Android Signing Patch

Expo generates native Android files during CI. `scripts/configure-android-signing.js` patches the generated `android/app/build.gradle` so the release build uses Codemagic keystore variables:

- `CM_KEYSTORE_PATH`
- `CM_KEYSTORE_PASSWORD`
- `CM_KEY_ALIAS`
- `CM_KEY_PASSWORD`

Do not commit keystores, certificates, provisioning profiles, or service account JSON files.

## Useful Commands

```bash
npm run build:ios
npm run build:android
npm run submit:ios
npm run submit:android
```

These use EAS. Codemagic builds use the checked-in `codemagic.yaml`.
