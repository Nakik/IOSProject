const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(process.cwd(), 'app.json');
const appJsonTempPath = `${appJsonPath}.tmp`;
const buildNumber = Number.parseInt(
  process.env.CM_BUILD_NUMBER || process.env.BUILD_NUMBER || '1',
  10,
);

if (!Number.isInteger(buildNumber) || buildNumber < 1) {
  throw new Error('Codemagic build number must be a positive integer.');
}

const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

appJson.expo = appJson.expo || {};
appJson.expo.ios = appJson.expo.ios || {};
appJson.expo.android = appJson.expo.android || {};

appJson.expo.ios.buildNumber = String(buildNumber);
appJson.expo.android.versionCode = buildNumber;

fs.writeFileSync(appJsonTempPath, `${JSON.stringify(appJson, null, 2)}\n`);
fs.renameSync(appJsonTempPath, appJsonPath);

console.log(`Set iOS buildNumber and Android versionCode to ${buildNumber}.`);
