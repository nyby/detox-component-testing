import {mount} from '@nyby/detox-component-testing/test';

describe('ShowError', () => {
  it('renders view with missing name prop', async () => {
    await mount('ShowError');
  });
});
