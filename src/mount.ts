export interface SpyMarker {
  readonly __detoxSpy__: true;
  readonly name: string;
}

export interface SpyExpectation {
  toHaveBeenCalled(): Promise<void>;
  toHaveBeenCalledTimes(n: number): Promise<void>;
  lastCalledWith(...args: any[]): Promise<void>;
}

const SPY_MARKER = '__detoxSpy__' as const;

let mountCounter = 0;
let appLaunched = false;

export function spy(name: string): SpyMarker {
  return {[SPY_MARKER]: true, name};
}

type MountProps = Record<string, string | number | boolean | SpyMarker>;

async function assertNoRenderError(): Promise<void> {
  try {
    await waitFor(element(by.id('detox-render-error')))
      .toExist()
      .withTimeout(500);
  } catch {
    return; // Element not found — no render error, all good
  }
  // Element exists — read the error message and throw
  const attrs = (await element(by.id('detox-render-error-message')).getAttributes()) as any;
  const message = attrs.text || attrs.label || 'Unknown render error';
  throw new Error(`Component render error: ${message}`);
}

export async function mount(componentName: string, props?: MountProps): Promise<void> {
  const payload = {
    id: String(++mountCounter),
    name: componentName,
    props: {} as Record<string, any>,
    spies: [] as string[],
  };

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (value && typeof value === 'object' && SPY_MARKER in value) {
        payload.spies.push(key);
      } else {
        payload.props[key] = value;
      }
    });
  }

  const launchArgs: Record<string, any> = {detoxComponentName: componentName};
  Object.entries(payload.props).forEach(([key, value]) => {
    launchArgs[`detoxProp_${key}`] = value;
  });
  payload.spies.forEach((name) => {
    launchArgs[`detoxSpy_${name}`] = true;
  });
  await device.launchApp({newInstance: true, launchArgs});
  appLaunched = true;
  // Harness sets id '0' for the initial launch-args mount
  try {
    await waitFor(element(by.id('detox-mount-id')))
      .toHaveText('0')
      .withTimeout(5000);
  } catch (e) {
    await assertNoRenderError(); // Throws with the actual error if one exists
    throw e; // Re-throw original timeout if no render error found
  }
  await assertNoRenderError();
}

export function expectSpy(name: string): SpyExpectation {
  // Detox's expect is injected as a global by the test environment.
  // Resolve lazily to avoid ReferenceError at module load time.
  const getExpect = () => expect as unknown as (e: any) => any;
  return {
    async toHaveBeenCalled() {
      await getExpect()(element(by.id(`spy-${name}-count`))).not.toHaveText('0');
    },
    async toHaveBeenCalledTimes(n: number) {
      await getExpect()(element(by.id(`spy-${name}-count`))).toHaveText(String(n));
    },
    async lastCalledWith(...args: any[]) {
      await getExpect()(element(by.id(`spy-${name}-lastArgs`))).toHaveText(JSON.stringify(args));
    },
  };
}
