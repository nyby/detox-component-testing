/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    forwardEnv: true,
  },
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/example.app',
      build:
        'xcodebuild -workspace ios/example.xcworkspace -UseNewBuildSystem=NO -scheme example -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      start: 'scripts/start-rn.sh ios',
    },
    android: {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android ; ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug ; cd -',
      start: 'scripts/start-rn.sh android',
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 17',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_8',
      },
      reversePorts: [8081],
    },
  },
  configurations: {
    'ios.sim.component': {
      device: 'simulator',
      app: 'ios',
      testRunner: {
        args: {
          config: 'component-tests/jest.config.js',
          _: ['src/components'],
        },
      },
      behavior: {
        init: {
          reinstallApp: false,
        },
      },
    },
    'android.emu.component': {
      device: 'emulator',
      app: 'android',
      testRunner: {
        args: {
          config: 'component-tests/jest.config.js',
          _: ['src/components'],
        },
      },
    },
  },
};
