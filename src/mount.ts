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
  return { [SPY_MARKER]: true, name };
}

type MountProps = Record<string, string | number | boolean | SpyMarker>;

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

  if (!appLaunched) {
    const launchArgs: Record<string, any> = { detoxComponentName: componentName };
    Object.entries(payload.props).forEach(([key, value]) => {
      launchArgs[`detoxProp_${key}`] = value;
    });
    payload.spies.forEach(name => {
      launchArgs[`detoxSpy_${name}`] = true;
    });
    await device.launchApp({ newInstance: true, launchArgs });
    appLaunched = true;
    return;
  }

  await element(by.id('detox-harness-control')).replaceText(JSON.stringify(payload));
  await waitFor(element(by.id('detox-mount-id'))).toHaveText(payload.id).withTimeout(5000);
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
