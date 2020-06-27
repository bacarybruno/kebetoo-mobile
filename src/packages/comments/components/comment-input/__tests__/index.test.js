import setupTest from 'Kebetoo/src/config/jest-setup'
import { AudioPlayer } from 'Kebetoo/src/shared/components/audio-player'

import CommentInput from '../index'
import strings from 'Kebetoo/src/config/strings'
import { act } from 'react-test-renderer'

const givenCommentInput = setupTest(CommentInput)({
  onChange: jest.fn(),
  onSend: jest.fn(),
  value: '',
  isLoading: false,
  audioRecorder: {
    hasRecording: false,
  },
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
  expect(input.props.wrapperStyle).toEqual(
    expect.objectContaining({ height: expectedHeight }),
  )
})
