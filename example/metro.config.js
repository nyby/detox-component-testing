const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const componentTestingRoot = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [componentTestingRoot],
  resolver: {
    blockList: [/detox\/node_modules\/react-native\/.*/, /detox-component-testing\/node_modules\/.*/],
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
