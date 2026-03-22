const DetoxCircusEnvironment = require("detox/runners/jest/testEnvironment");
const { join } = require("path");
const { captureArtifacts } = require("./debug");

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  async handleTestEvent(event, state) {
    await super.handleTestEvent(event, state);

    if (event.name === "test_done" && event.test.errors.length > 0) {
      const safeName = event.test.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const outputDir = join(process.cwd(), "artifacts");
      await captureArtifacts(safeName, outputDir, this.global.device);
    }
  }
}

module.exports = CustomDetoxEnvironment;
