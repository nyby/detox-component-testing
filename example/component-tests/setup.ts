import {execSync} from 'child_process';

// Disable Android autofill to prevent "Save password to Google" prompts
beforeAll(() => {
  try {
    execSync('adb shell settings put secure autofill_service null');
  } catch (e) {
    // Ignore if not on Android
  }
});
