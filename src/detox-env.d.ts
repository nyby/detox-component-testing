// Ambient declarations for Detox globals injected by the test runner at runtime.
declare const device: {
  launchApp(config?: any): Promise<void>;
  takeScreenshot(name: string): Promise<string>;
  generateViewHierarchyXml(): Promise<string>;
};
declare function element(matcher: any): any;
declare const by: { id(id: string): any };
declare function waitFor(e: any): any;
declare function expect(e: any): any;
