const {LaunchArguments} = require('react-native-launch-arguments');

if (LaunchArguments.value().detoxComponentName) {
  require('./test');
} else {
  require('./app');
}
