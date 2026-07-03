const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  throw new Error('android/app/build.gradle was not found. Run expo prebuild first.');
}

let source = fs.readFileSync(buildGradlePath, 'utf8');

if (source.includes('CM_KEYSTORE_PATH')) {
  console.log('Android release signing is already configured.');
  process.exit(0);
}

function findMatchingBrace(text, openBraceIndex) {
  let depth = 0;

  for (let index = openBraceIndex; index < text.length; index += 1) {
    if (text[index] === '{') {
      depth += 1;
    }

    if (text[index] === '}') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function insertReleaseSigningConfig(text) {
  const signingConfigsIndex = text.indexOf('signingConfigs {');

  if (signingConfigsIndex === -1) {
    throw new Error('Could not find signingConfigs block in android/app/build.gradle.');
  }

  const openBraceIndex = text.indexOf('{', signingConfigsIndex);
  const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

  if (closeBraceIndex === -1) {
    throw new Error('Could not parse signingConfigs block in android/app/build.gradle.');
  }

  const releaseConfig = `
        release {
            if (System.getenv()["CI"]) {
                storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                keyAlias System.getenv()["CM_KEY_ALIAS"]
                keyPassword System.getenv()["CM_KEY_PASSWORD"]
            }
        }
`;

  return `${text.slice(0, closeBraceIndex)}${releaseConfig}${text.slice(closeBraceIndex)}`;
}

function useReleaseSigningConfig(text) {
  const buildTypesIndex = text.indexOf('buildTypes {');

  if (buildTypesIndex === -1) {
    throw new Error('Could not find buildTypes block in android/app/build.gradle.');
  }

  const releaseIndex = text.indexOf('release {', buildTypesIndex);

  if (releaseIndex === -1) {
    throw new Error('Could not find release build type in android/app/build.gradle.');
  }

  const openBraceIndex = text.indexOf('{', releaseIndex);
  const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

  if (closeBraceIndex === -1) {
    throw new Error('Could not parse release build type in android/app/build.gradle.');
  }

  const beforeRelease = text.slice(0, releaseIndex);
  const releaseBlock = text
    .slice(releaseIndex, closeBraceIndex + 1)
    .replace(/signingConfig signingConfigs\.debug/g, 'signingConfig signingConfigs.release');
  const afterRelease = text.slice(closeBraceIndex + 1);

  return `${beforeRelease}${releaseBlock}${afterRelease}`;
}

source = insertReleaseSigningConfig(source);
source = useReleaseSigningConfig(source);

fs.writeFileSync(buildGradlePath, source);
console.log('Configured Android release signing from Codemagic keystore variables.');
