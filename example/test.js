import { AppRegistry, View } from "react-native";
import {
  ComponentHarness,
  configureHarness,
} from "@nyby/detox-component-testing";
import "./component-tests/registry.ts";

configureHarness({
  wrapper: ({ children }) => (
    <View style={{ flex: 1, paddingTop: 60 }}>{children}</View>
  ),
});

AppRegistry.registerComponent("example", () => ComponentHarness);
