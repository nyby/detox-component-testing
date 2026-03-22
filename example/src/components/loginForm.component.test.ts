import {by, element, expect} from 'detox';
import {mount} from '@nyby/detox-component-testing/test';

describe('LoginForm', () => {
  it('renders form fields', async () => {
    await mount('LoginForm');
    await expect(element(by.id('username'))).toBeVisible();
    await expect(element(by.id('password'))).toBeVisible();
    await expect(element(by.id('submit'))).toBeVisible();
  });

  it('shows error on empty submit', async () => {
    await mount('LoginForm');
    await element(by.id('submit')).tap();
    await expect(element(by.id('error'))).toHaveText('Username and password are required');
  });

  it('can type and submit', async () => {
    await mount('LoginForm');
    await element(by.id('username')).typeText('testuser');
    await element(by.id('password')).typeText('secret123');
    await element(by.id('submit')).tap();
    await expect(element(by.id('error'))).not.toExist();
  });
});
