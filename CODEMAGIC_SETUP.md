# Codemagic GitHub Setup

This project keeps the Expo app source as-is and adds Codemagic configuration at the repository root.

## Upload To GitHub

From `D:\IOSApps`, run:

```bash
git status
git add .
git commit -m "Add Codemagic CI/CD"
git branch -M main
```

Create an empty GitHub repository in the GitHub website, then connect and push:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

If `origin` already exists, use this instead:

```bash
git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Your Codemagic repository URL will be:

```text
https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME
```

## Put The URL In Codemagic

1. Open https://codemagic.io/start/
2. Connect GitHub.
3. Select the repository you pushed.
4. Choose the repository root as the app root.
5. Click `Check for configuration file`.
6. Codemagic should detect `codemagic.yaml`.
7. Start `Expo Android Preview APK` or `Expo iOS Simulator App`.

The preview workflows do not need Apple or Google signing secrets.

## Workflows

- `Expo Quality Checks`: TypeScript and ESLint.
- `Expo Android Preview APK`: unsigned debug APK for Codemagic artifacts and App Preview.
- `Expo iOS Simulator App`: unsigned `.app` for Codemagic artifacts and App Preview.
- `Expo Android Release AAB`: signed release bundle. Requires Android keystore reference `ios_apps_upload_keystore`.
- `Expo iOS Release IPA`: signed release IPA. Requires App Store Connect integration named `Codemagic` and Apple signing setup.

## Later Store Release Setup

For Android release builds, upload a keystore in Codemagic Team settings and use this reference name:

```text
ios_apps_upload_keystore
```

For iOS release builds, configure Codemagic App Store Connect integration with this name:

```text
Codemagic
```

The app identifiers currently used by the project are:

```text
iOS bundle identifier: com.iosapps.app
Android package name:  com.iosapps.app
```
