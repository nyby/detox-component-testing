import {ComponentType} from 'react';

export interface ComponentEntry<P = any> {
  Component: ComponentType<P>;
  defaultProps: Partial<P>;
}

const registry = new Map<string, ComponentEntry>();

export function registerComponent<P>(
  name: string,
  Component: ComponentType<P>,
  defaultProps?: Partial<P>,
): void;
export function registerComponent<P>(Component: ComponentType<P>, defaultProps?: Partial<P>): void;
export function registerComponent<P>(
  nameOrComponent: string | ComponentType<P>,
  componentOrProps?: ComponentType<P> | Partial<P>,
  defaultProps?: Partial<P>,
): void {
  if (typeof nameOrComponent === 'string') {
    registry.set(nameOrComponent, {
      Component: componentOrProps as ComponentType<P>,
      defaultProps: (defaultProps || {}) as Partial<P>,
    });
  } else {
    const Component = nameOrComponent;
    const name = Component.displayName || Component.name;
    if (!name) {
      throw new Error(
        '[detox-component-testing] Component must have a name or displayName to register without an explicit name.',
      );
    }
    registry.set(name, {
      Component,
      defaultProps: ((componentOrProps as Partial<P>) || {}) as Partial<P>,
    });
  }
}

export function getComponent(name: string): ComponentEntry {
  const entry = registry.get(name);
  if (!entry) {
    throw new Error(
      `[detox-component-testing] Component "${name}" not found in registry. Did you call registerComponent()?`,
    );
  }
  return entry;
}