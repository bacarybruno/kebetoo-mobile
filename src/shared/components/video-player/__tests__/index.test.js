import setupTest from '@app/config/jest-setup';
import routes from '@app/navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import Video from 'react-native-video';

import VideoPlayer from '../index';

const givenVideoPlayer = setupTest(VideoPlayer)({
  source: 'jest://kebetoo.app/video-source.mp4',
  localSource: 'rnfs://video-source.mp4',
  duration: 30,
  thumbnail: 'jest://kebetoo.app/thumbnails/video-source.png',
  preview: 'jest://kebetoo.app/thumbnails/video-source.gif',
});

it('renders VideoPlayer', () => {
  const { wrapper } = givenVideoPlayer();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('computes video duration if not available', () => {
  const { wrapper } = givenVideoPlayer({ duration: 0 });
  expect(wrapper.root.findAllByProps({ testID: 'badge' }).length).toBe(0);
  const video = wrapper.root.findByType(Video);
  video.props.onLoad({ duration: 10 });
  expect(wrapper.root.findByProps({ testID: 'badge' }).props.text).toBe('0:10');
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('navigate to fullscreen video on press', () => {
  const { wrapper, props } = givenVideoPlayer();
  fireEvent.press(wrapper.root.findByType(TouchableOpacity));
  expect(useNavigation().navigate).toBeCalledTimes(1);
  expect(useNavigation().navigate).toBeCalledWith(routes.MODAL_VIDEO, {
    source: props.source,
    poster: props.thumbnail,
  });
});
