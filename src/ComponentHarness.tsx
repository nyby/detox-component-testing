import React, {
  Component as ReactComponent,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { LaunchArguments } from "react-native-launch-arguments";
import { getComponent } from "./ComponentRegistry";
import { getWrapper } from "./configureHarness";

interface ErrorBoundaryState {
  error: Error | null;
}

class RenderErrorBoundary extends ReactComponent<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView testID="detox-render-error">
          <Text testID="detox-render-error-message">
            {this.state.error.message}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const PROP_PREFIX = "detoxProp_";
const SPY_PREFIX = "detoxSpy_";

interface MountPayload {
  id: string;
  name: string;
  props: Record<string, any>;
  spies: string[];
}

function parseLaunchArgs(args: Record<string, any>): {
  props: Record<string, any>;
  spies: string[];
} {
  const props: Record<string, any> = {};
  const spies: string[] = [];
  Object.entries(args).forEach(([key, value]) => {
    if (key.startsWith(PROP_PREFIX)) {
      props[key.slice(PROP_PREFIX.length)] = value;
    } else if (key.startsWith(SPY_PREFIX)) {
      spies.push(key.slice(SPY_PREFIX.length));
    }
  });
  return { props, spies };
}

export function ComponentHarness() {
  const launchArgs = LaunchArguments.value() as Record<string, any>;
  const [mountPayload, setMountPayload] = useState<MountPayload | null>(null);

  const handleControl = useCallback((e: { nativeEvent: { text: string } }) => {
    try {
      setMountPayload(JSON.parse(e.nativeEvent.text));
    } catch (_e) {}
  }, []);

  let activeMount: MountPayload | null = null;
  if (mountPayload) {
    activeMount = mountPayload;
  } else if (launchArgs.detoxComponentName) {
    const { props, spies } = parseLaunchArgs(launchArgs);
    activeMount = {
      id: "0",
      name: launchArgs.detoxComponentName as string,
      props,
      spies,
    };
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        testID="detox-harness-control"
        onEndEditing={handleControl}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 44,
          opacity: 0.01,
          zIndex: 9999,
        }}
      />
      {activeMount && (
        <>
          <Text testID="detox-mount-id" style={{ height: 1 }}>
            {activeMount.id}
          </Text>
          <RenderErrorBoundary>
            <ComponentRenderer key={activeMount.id} mount={activeMount} />
          </RenderErrorBoundary>
        </>
      )}
    </View>
  );
}

interface SpyData {
  count: number;
  lastArgs: any[];
}

function ComponentRenderer({ mount }: { mount: MountPayload }) {
  const { Component, defaultProps } = getComponent(mount.name);
  const spyNames = mount.spies || [];

  const initialData: Record<string, SpyData> = {};
  spyNames.forEach((name) => {
    initialData[name] = { count: 0, lastArgs: [] };
  });

  const [spyData, setSpyData] = useState(initialData);

  const spyFnsRef = useRef<Record<string, (...args: any[]) => void>>({});
  const spyProps: Record<string, (...args: any[]) => void> = {};
  spyNames.forEach((name) => {
    if (!spyFnsRef.current[name]) {
      spyFnsRef.current[name] = (...callArgs: any[]) => {
        setSpyData((prev) => ({
          ...prev,
          [name]: {
            count: (prev[name]?.count || 0) + 1,
            lastArgs: callArgs,
          },
        }));
      };
    }
    spyProps[name] = spyFnsRef.current[name];
  });

  const props = { ...defaultProps, ...(mount.props || {}), ...spyProps };
  const Wrapper = getWrapper();

  return (
    <Wrapper launchArgs={mount.props || {}}>
      <View testID="component-harness-root" style={{ flex: 1 }}>
        <Component {...props} />
        {spyNames.map((name) => (
          <View key={name}>
            <Text testID={`spy-${name}-count`}>
              {String(spyData[name].count)}
            </Text>
            <Text testID={`spy-${name}-lastArgs`}>
              {JSON.stringify(spyData[name].lastArgs)}
            </Text>
          </View>
        ))}
      </View>
    </Wrapper>
  );
}
