import { ComponentType, ReactNode } from 'react';

export interface WrapperProps {
  children: ReactNode;
  launchArgs: Record<string, any>;
}

export interface HarnessConfig {
  wrapper: ComponentType<WrapperProps>;
}

const DefaultWrapper = ({ children }: WrapperProps) => children;

let globalWrapper: ComponentType<WrapperProps> | null = null;

export function configureHarness(config: HarnessConfig): void {
  globalWrapper = config.wrapper;
}

export function getWrapper(): ComponentType<WrapperProps> {
  return globalWrapper || DefaultWrapper;
}
