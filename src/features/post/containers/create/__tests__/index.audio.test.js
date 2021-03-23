import setupTest from '@app/config/jest-setup'
import { AudioPlayer } from '@app/shared/components/audio-player'

import CreatePost, { actionTypes } from '../index'

jest.mock('@app/shared/hooks', () => ({
  useAudioRecorder: jest.fn().mockReturnValue({ hasRecording: true }),
  useAnalytics: jest.fn().mockReturnValue({ reportError: jest.fn() }),
  useAppColors: jest.fn().mockReturnValue({ colors: {} }),
  useAppStyles: jest.fn().mockReturnValue({ icon: {} }),
  useKeyboard: jest.fn().mockReturnValue({}),
  useUser: jest.fn().mockReturnValue({ profile: {} }),
}))

const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn().mockImplementation((params) => {
      if (params.headerRight) params.headerRight()
    }),
    dispatch: jest.fn(),
    addListener: jest.fn(),
  },
  route: {
    params: {
      action: actionTypes.SHARE,
    },
  },
})

it('renders AudioPlayer if post has recording', () => {
  const { wrapper } = givenCreatePost()
  expect(wrapper.toJSON()).toMatchSnapshot()
  expect(wrapper.root.findAllByType(AudioPlayer).length).toBe(1)
})
