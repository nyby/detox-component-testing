# Component Testing Example

A React Native app demonstrating [`@nyby/detox-component-testing`](../README.md).

## Components

- **Stepper** — counter with increment/decrement buttons and `onChange` callback
- **LoginForm** — form with validation and submit
- **Greeting** — simple text display
- **ShowError** — demonstrates error boundary handling

## Setup

```sh
npm install
```

### iOS

```sh
npm run podInstall:ios
npm run build:ios
```

### Android

```sh
npm run build:android
```

## Running Component Tests

Run tests:

```sh
npm run test:ios
# or
npm run test:android
```

## Project Structure

```
index.js                           # Entry point — switches to test harness when detoxComponentName is set
test.js                            # Component test entry — registers ComponentHarness
app.js                             # Production app entry

src/components/
  Stepper.tsx                      # Component source
  stepper.component.test.ts        # Component test
  LoginForm.tsx
  loginForm.component.test.ts
  Greeting.tsx
  greeting.component.test.ts
  ShowError.tsx
  ShowError.component.test.ts

component-tests/
  registry.ts                      # Registers components for testing
  jest.config.js                   # Jest config for Detox component tests
  setup.ts                         # Test setup

detox.config.js                    # Detox configuration
```
