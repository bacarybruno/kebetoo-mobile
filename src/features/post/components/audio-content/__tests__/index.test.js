import { render, fireEvent } from 'react-native-testing-library'

import { constructFileName } from '@app/shared/hooks/audio-recorder'
import setupTest from '@app/config/jest-setup'

import AudioContent from '../index'

const givenAudioContent = setupTest(AudioContent, render)({
  content: 'test audio',
  audioUrl: '/fake-audio.mp3',
  style: { elevation: 3 },
  onPress: jest.fn(),
  // date format: YYYYMMDD
  audioName: constructFileName(20200625, 10),
})

it('renders AudioContent', () => {
  const { wrapper } = givenAudioContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles player press', () => {
  const { wrapper, props } = givenAudioContent()
  fireEvent.press(wrapper.getByTestId('player-wrapper'))
  expect(props.onPress).toBeCalledTimes(1)
})
