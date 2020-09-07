import { fireEvent, act } from 'react-native-testing-library'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native'

import setupTest from '@app/config/jest-setup'
import { readableSeconds } from '@app/shared/helpers/dates'

import AudioPlayer, { PlayButton, DeleteIconButton } from '../index'

jest.useFakeTimers()

const givenAudioPlayer = setupTest(AudioPlayer)({
  source: 'http://localhost:1337/uploads/PTT_20200618_4_77ef44ec7b.mp3',
})

it('renders AudioPlayer', () => {
  const { wrapper } = givenAudioPlayer()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders AudioPlayer with delete icon', () => {
  const { wrapper } = givenAudioPlayer({
    onDelete: jest.fn(),
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders round AudioPlayer', () => {
  const { wrapper } = givenAudioPlayer({
    round: true,
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('player states', () => {
  it('shows default state on render', () => {
    const { wrapper } = givenAudioPlayer()
    expect(wrapper.root.findByProps({ text: readableSeconds(0) })).toBeTruthy()
    expect(wrapper.root.findByProps({ testID: 'progress' }).props.style).toMatchObject({ width: '0%' })
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-play')
  })
  it('initialize player', () => {
    const { wrapper } = givenAudioPlayer()
    fireEvent.press(wrapper.root.findByType(PlayButton))
    expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(1)
  })
  it('plays audio', () => {
    const { wrapper, props } = givenAudioPlayer({
      player: {
        play: jest.fn(),
        isLoaded: jest.fn().mockReturnValue(true),
        isPlaying: jest.fn().mockReturnValue(false),
        getDuration: jest.fn().mockReturnValue(5000),
        getCurrentTime: jest.fn().mockReturnValue((callback) => {
          callback(1000)
        }),
      },
    })
    act(() => {
      fireEvent.press(wrapper.root.findByType(PlayButton))
    })
    expect(props.player.play).toBeCalledTimes(1)
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-pause')
  })
  it('pause audio', () => {
    const { wrapper, props } = givenAudioPlayer({
      player: {
        pause: jest.fn(),
        isLoaded: jest.fn().mockReturnValue(true),
        isPlaying: jest.fn().mockReturnValue(true),
      },
    })
    act(() => {
      fireEvent.press(wrapper.root.findByType(PlayButton))
    })
    expect(props.player.pause).toBeCalledTimes(1)
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-play')
  })
})

describe('player wrapper', () => {
  it('handles player press', () => {
    const { wrapper, props } = givenAudioPlayer({
      onPress: jest.fn(),
    })
    const playerWrapper = wrapper.root.findByProps({ testID: 'player-wrapper' })
    playerWrapper.props.onPress()
    expect(props.onPress).toBeCalledTimes(1)
  })
  it('toggle player if no custom onPress handler', () => {
    const { wrapper, props } = givenAudioPlayer({
      player: {
        pause: jest.fn(),
        isLoaded: jest.fn().mockReturnValue(true),
        isPlaying: jest.fn().mockReturnValue(true),
      },
    })
    act(() => {
      fireEvent.press(wrapper.root.findByProps({ testID: 'player-wrapper' }))
    })
    expect(props.player.pause).toBeCalledTimes(1)
  })
})
it('handles delete button', () => {
  const { wrapper, props } = givenAudioPlayer({
    onDelete: jest.fn(),
  })
  const deleteButton = wrapper.root.findByType(DeleteIconButton)
  expect(deleteButton).toBeTruthy()
  fireEvent.press(deleteButton)
  expect(props.onDelete).toBeCalledTimes(1)
})
