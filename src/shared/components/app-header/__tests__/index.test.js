import setupTest from '@app/config/jest-setup';
import routes from '@app/navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { fireEvent } from 'react-native-testing-library';

import Header, { HeaderAvatar } from '../index';

const givenHeader = setupTest(Header)({
  displayName: 'Bruno Bodian',
  imageSrc: 'https://avatars1.githubusercontent.com/u/14147533',
  showAvatar: true,
  style: {
    backgroundColor: 'red',
  },
});

it('renders Header', () => {
  const { wrapper } = givenHeader();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('navigates to profile', () => {
  const { wrapper } = givenHeader();
  fireEvent.press(wrapper.root.findByType(HeaderAvatar));
  expect(useNavigation().navigate).toBeCalledTimes(1);
  expect(useNavigation().navigate).toBeCalledWith(routes.PROFILE);
});
