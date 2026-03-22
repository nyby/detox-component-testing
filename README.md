# @nyby/detox-component-testing

Component testing for React Native with [Detox](https://github.com/wix/Detox). Mount individual components in isolation on a real device or emulator and test them with the full Detox API.

## How It Works

Unlike Cypress (where tests and components share the same browser runtime), Detox tests run in **Node.js** while components render on a **device/emulator**. The two communicate over WebSocket.

```
Test (Node.js/Jest)                    App (React Native on device)
───────────────────                    ────────────────────────────
mount('Stepper', { initial: 5 })  →   renders <Stepper initial={5} />
element(by.id('increment')).tap() →   taps the native button
expect(...).toHaveText('6')       →   asserts on the native view tree
```

This means test files **cannot** import React components or use JSX — they can only send serializable data (strings, numbers, booleans) to the device. The `mount()` function references components by the name they were registered with.

## Setup

### 1. Install dependencies

```bash
npm install @nyby/detox-component-testing react-native-launch-arguments
```

`react-native-launch-arguments` is a native module — rebuild your app after installing.

### 2. Create a component test entry point

Create `app.component-test.js` alongside your app entry:

```js
import React from 'react';
import {AppRegistry, View} from 'react-native';
import {ComponentHarness, configureHarness} from '@nyby/detox-component-testing';
import './component-tests/registry';

configureHarness({
  wrapper: ({children}) => (
    <View style={{flex: 1}}>{children}</View>
  ),
});

AppRegistry.registerComponent('example', () => ComponentHarness);
```

### 3. Register your components

Create `component-tests/registry.ts` to register components for testing:

```ts
import {registerComponent} from '@nyby/detox-component-testing';
import {Stepper} from '../src/components/Stepper';
import {LoginForm} from '../src/components/LoginForm';

// Auto-infer name from Component.name
registerComponent(Stepper, {initial: 0});
registerComponent(LoginForm);

// Or use an explicit name
registerComponent('MyComponent', MyComponent, {someProp: 'default'});
```

### 4. Switch entry point for component tests

Update your index file to load the component test entry when running component tests:

```js
// index.js
const {LaunchArguments} = require('react-native-launch-arguments');

if (LaunchArguments.value().detoxComponentName) {
  require('./app.component-test');
} else {
  require('./app');
}
```

This keeps your production app clean — the harness and test components are only loaded during component testing.

### 5. Configure Detox

Add a component test configuration to `detox.config.js`:

```js
module.exports = {
  // ... existing app and device config
  configurations: {
    // ... existing configurations
    'ios.sim.component': {
      device: 'simulator',
      app: 'ios',
      testRunner: {
        args: {
          config: 'component-tests/jest.config.js',
          _: ['src/components'],
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
```

### 6. Create Jest config for component tests

Create `component-tests/jest.config.js`:

```js
module.exports = {
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  setupFilesAfterEnv: ['./setup.ts'],
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  roots: ['<rootDir>/../src'],
  testMatch: ['**/*.component.test.ts'],
  transform: {
    '\\.tsx?$': ['ts-jest', {tsconfig: '<rootDir>/../tsconfig.json'}],
  },
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};
```

## Writing Tests

### Basic mounting

```ts
import {by, element, expect} from 'detox';
import {mount} from '@nyby/detox-component-testing/test';

describe('Stepper', () => {
  it('renders with default props', async () => {
    await mount('Stepper');
    await expect(element(by.id('counter'))).toHaveText('0');
  });

  it('renders with custom props', async () => {
    await mount('Stepper', {initial: 100});
    await expect(element(by.id('counter'))).toHaveText('100');
  });
});
```

### Testing callbacks with spies

Use `spy()` to create a recording function for callback props, and `expectSpy()` to assert on it:

```ts
import {mount, spy, expectSpy} from '@nyby/detox-component-testing/test';

it('fires onChange when incremented', async () => {
  await mount('Stepper', {initial: 0, onChange: spy('onChange')});
  await element(by.id('increment')).tap();

  await expectSpy('onChange').toHaveBeenCalled();
  await expectSpy('onChange').toHaveBeenCalledTimes(1);
  await expectSpy('onChange').lastCalledWith(1);
});
```

The spy system works across the process boundary — the app-side harness creates a real recording function and exposes call data via hidden UI elements that `expectSpy()` reads.

### Performance

The first `mount()` call per test file launches the app (~9s). Subsequent mounts within the same file swap the component in-place without restarting — typically under 100ms.

```
First mount:      ~9s  (app launch)
Subsequent mounts: ~100ms (in-place swap)
```

## API Reference

### App-side (import from `@nyby/detox-component-testing`)

#### `registerComponent(Component, defaultProps?)`
#### `registerComponent(name, Component, defaultProps?)`

Register a component for testing. When called with just a component, the name is inferred from `Component.name` or `Component.displayName`.

#### `ComponentHarness`

Root component for the test harness. Register as your app's root component in the component test entry point.

#### `configureHarness({ wrapper? })`

Set a global wrapper component for all mounted components:

```js
import {Provider} from 'react-redux';
import {configureHarness} from '@nyby/detox-component-testing';
import {createStore} from './store';

configureHarness({
  wrapper: ({children, launchArgs}) => {
    const store = createStore();
    if (launchArgs.reduxState) {
      store.dispatch(loadState(JSON.parse(launchArgs.reduxState)));
    }
    return <Provider store={store}>{children}</Provider>;
  },
});
```

The wrapper receives `launchArgs` — the props passed to `mount()` — so you can configure per-test state.

### Test-side (import from `@nyby/detox-component-testing/test`)

#### `mount(componentName, props?)`

Mount a registered component on the device. Props are passed as flat key-value pairs (strings, numbers, booleans). Use `spy()` for callback props.

#### `spy(name)`

Create a spy marker for a callback prop. The harness replaces this with a recording function on the app side.

#### `expectSpy(name)`

Returns an assertion object for a spy:

- `.toHaveBeenCalled()` — spy was called at least once
- `.toHaveBeenCalledTimes(n)` — spy was called exactly `n` times
- `.lastCalledWith(...args)` — the last call's arguments match

## Limitations

- **No JSX in tests** — Tests run in Node.js, not the React Native runtime. You cannot import components or use JSX in test files. Reference components by their registered name string.
- **Flat props only** — Props passed through `mount()` must be serializable (strings, numbers, booleans). Nested objects and arrays are not supported. Use `configureHarness({ wrapper })` for complex state like Redux stores.
- **Callbacks are spies, not real functions** — You can't pass arbitrary callback implementations. Use `spy()` to record calls and assert on them with `expectSpy()`.

## Project Structure

A typical project using `@nyby/detox-component-testing`:

```
src/
  components/
    Stepper.tsx                    # Component source
    stepper.component.test.ts      # Component test (co-located)
    LoginForm.tsx
    loginForm.component.test.ts

component-tests/
  registry.ts                      # Component registrations
  jest.config.js                   # Jest config for component tests
  setup.ts                         # Test setup

app.js                             # Production app entry
app.component-test.js              # Component test entry (harness)
index.js                           # Switches entry based on launch args
detox.config.js                    # Detox config with component test configuration
```

See the [`example/`](./example) directory for a complete working setup.
