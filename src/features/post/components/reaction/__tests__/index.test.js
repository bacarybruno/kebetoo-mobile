import setupTest from '@app/config/jest-setup';

import Reaction from '../index';

const givenReaction = setupTest(Reaction)({
  iconName: 'like',
  count: 1100,
  onPress: jest.fn(),
  color: 'reactions',
});

it('renders Reaction', () => {
  const { wrapper } = givenReaction();
  expect(wrapper.toJSON()).toMatchSnapshot();
});
