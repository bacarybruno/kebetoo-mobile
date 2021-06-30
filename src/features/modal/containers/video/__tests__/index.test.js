import changeNavigationBarColor from 'react-native-navigation-bar-color';
import VideoPlayer from 'react-native-video-controls';

import setupTest from '@app/config/jest-setup';
import colors, { rgbaToHex } from '@app/theme/colors';

import VideoModal from '../index';

beforeEach(jest.clearAllMocks);

const givenVideoModal = setupTest(VideoModal)({
  navigation: {
    setOptions: jest.fn(),
    goBack: jest.fn(),
  },
  route: {
    params: {
      source: 'jest://fake-video.mp4',
      poster: 'jest://fake-video-poster.png',
    },
  },
});

it('renders VideoModal', () => {
  const { wrapper } = givenVideoModal();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('navigates back', () => {
  const { wrapper, props } = givenVideoModal();
  const player = wrapper.root.findByType(VideoPlayer);
  player.props.onBack();
  expect(props.navigation.goBack).toBeCalledTimes(1);
});

it('hides controls', () => {
  const { wrapper } = givenVideoModal();
  const player = wrapper.root.findByType(VideoPlayer);
  player.props.onHideControls();
  expect(changeNavigationBarColor).toBeCalledWith(rgbaToHex(colors.black));
});

it('resets styles on unmount', () => {
  const { wrapper } = givenVideoModal();
  wrapper.unmount();
  expect(changeNavigationBarColor).toBeCalledTimes(2);
  expect(changeNavigationBarColor).toBeCalledWith(rgbaToHex(colors.background));
});
