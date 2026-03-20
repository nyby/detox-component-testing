import {AppRegistry} from 'react-native';
import {ComponentHarness} from '@nyby/detox-component-testing';
import './component-tests/registry.ts';

AppRegistry.registerComponent('example', () => ComponentHarness);
