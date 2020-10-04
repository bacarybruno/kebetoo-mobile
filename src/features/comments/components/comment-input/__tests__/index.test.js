import setupTest from '@app/config/jest-setup'
import { AudioPlayer } from '@app/shared/components/audio-player'

import { strings } from '@app/config'
import { act } from 'react-test-renderer'

import CommentInput from '../index'

const givenCommentInput = setupTest(CommentInput)({
  onChange: jest.fn(),
  onSend: jest.fn(),
  value: '',
  isLoading: false,
  audioRecorder: {
    hasRecording: false,
  },
})

const { now } = Date
const originalInterval = setInterval

beforeEach(() => {
  jest.clearAllMocks()
  jest.setTimeout(10000)
  let time = now()
  Date.now = () => time
  const fakeInterval = global.setInterval
  global.setInterval = (fn, interval) => (
    fakeInterval((...args) => {
      time += interval
      fn(...args)
    }, interval)
  )
})

afterEach(() => {
  Date.now = now
  global.setInterval = originalInterval
})

it('renders CommentInput', () => {
  const { wrapper } = givenCommentInput()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders CommentInput with AudioPlayer', () => {
  const { wrapper } = givenCommentInput({
    audioRecorder: {
      hasRecording: true,
    },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders AudioPlayer and SendButton if it has recording', () => {
  const { wrapper } = givenCommentInput({
    audioRecorder: {
      hasRecording: true,
    },
  })
  expect(wrapper.root.findAllByType(AudioPlayer).length).toBeTruthy()
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeTruthy()
})

it('renders SendButton if it has text', () => {
  const { wrapper } = givenCommentInput({
    value: 'New comment',
  })
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeTruthy()
})

it('handles onSend', () => {
  const { wrapper, props } = givenCommentInput({
    value: 'New comment',
  })
  wrapper.root.findByProps({ testID: 'send-button' }).props.onPress()
  expect(props.onSend).toBeCalledTimes(1)
})

it('handles content size change', () => {
  const { wrapper } = givenCommentInput({
    value: 'New comment',
  })
  const input = wrapper.root.findByProps({ placeholder: strings.comments.add_comment })
  const expectedHeight = 100
  const event = {
    nativeEvent: {
      contentSize: {
        height: expectedHeight,
      },
    },
  }
  act(() => {
    input.props.onContentSizeChange(event)
  })
  setImmediate(() => {
    expect(input.props.height).toEqual(expectedHeight)
  })
})
