import { strings } from '@app/config';
import setupTest from '@app/config/jest-setup';

import Badge from '../index';

const givenBadge = setupTest(Badge)();

it('renders Badge', () => {
  const { wrapper } = givenBadge({
    text: strings.general.new,
    style: { backgroundColor: 'red', color: 'white' },
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});
