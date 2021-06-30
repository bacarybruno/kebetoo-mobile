import setupTest from '@app/config/jest-setup';

import VideoContent from '../index';

const givenVideoContent = setupTest(VideoContent)({
  content: 'Hello wirkd',
  videoName: 'VID-TEST-10',
  videoUrl: 'jest://kebetoo.app/video.mp4',
  localFileUri: 'rnfs://local-file.mp4',
  style: {},
  onPress: jest.fn(),
});

it('renders VideoContent', () => {
  const { wrapper } = givenVideoContent();
  expect(wrapper.toJSON()).toMatchSnapshot();
});
