import { mkdirSync, renameSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Capture a screenshot and native view hierarchy to the given directory.
 * Used by both the `debug()` helper and the custom test environment.
 */
export async function captureArtifacts(
  name: string,
  outputDir: string,
  deviceRef: {
    takeScreenshot: (n: string) => Promise<string>;
    generateViewHierarchyXml: () => Promise<string>;
  },
) {
  mkdirSync(outputDir, { recursive: true });

  // Screenshot via Detox, then move to our artifacts dir
  try {
    const tempPath = await deviceRef.takeScreenshot(`debug-${name}`);
    if (tempPath) {
      renameSync(tempPath, join(outputDir, `debug-${name}.png`));
    }
  } catch {}

  // Native view hierarchy
  try {
    const xml = await deviceRef.generateViewHierarchyXml();
    writeFileSync(join(outputDir, `debug-${name}-view.xml`), xml, "utf8");
  } catch {}
}

/**
 * Capture a screenshot and native view hierarchy.
 * Drop this anywhere in a test to inspect the current screen state.
 *
 * Usage:
 *   import { debug } from '@nyby/detox-component-testing/test';
 *   await debug();              // artifacts/debug-1.png, debug-1-view.xml
 *   await debug('after-tap');   // artifacts/debug-after-tap.png, etc.
 */
let counter = 0;

export async function debug(label?: string, outputDir?: string) {
  const name = label || String(++counter);
  const dir = outputDir || join(process.cwd(), "artifacts");
  await captureArtifacts(name, dir, device);
}
