const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /node_modules\/.*\/node_modules/g,
  /.*\/__tests__\/.*/g,
  /.*\/tests\/.*/g,
  /node_modules\/react-native\/ReactAndroid\/.*/g,
  /node_modules\/react-native\/ReactCommon\/.*/g,
];

config.watcher = {
  watchman: { enabled: false },
  usePolling: true,
  interval: 2000
};

module.exports = config;
