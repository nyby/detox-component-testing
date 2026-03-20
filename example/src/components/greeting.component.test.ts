import { by, element, expect } from 'detox';
import { mount } from '@nyby/detox-component-testing/test';

describe('Greeting', () => {
  it('renders greeting with name prop', async () => {
    await mount('Greeting', { name: 'World' });
    await expect(element(by.id('greeting'))).toHaveText('Hello, World!');
  });

  it('renders greeting with a different name', async () => {
    await mount('Greeting', { name: 'Detox' });
    await expect(element(by.id('greeting'))).toHaveText('Hello, Detox!');
  });
});
