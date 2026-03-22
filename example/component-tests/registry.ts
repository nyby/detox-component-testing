import {registerComponent} from '@nyby/detox-component-testing';
import {Stepper} from '../src/components/Stepper';
import {LoginForm} from '../src/components/LoginForm';
import {Greeting} from '../src/components/Greeting';
import {ShowError} from '../src/components/ShowError';

registerComponent(Stepper, {initial: 0});
registerComponent(LoginForm);
registerComponent(Greeting, {name: 'World'});
registerComponent(ShowError);
