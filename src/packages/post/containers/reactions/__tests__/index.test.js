import { act } from 'react-test-renderer'
import { useNavigation } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'

import setupTest from 'Kebetoo/src/config/jest-setup'
import posts from 'Kebetoo/__fixtures__/posts'
import authors from 'Kebetoo/__fixtures__/authors'
import routes from 'Kebetoo/src/navigation/routes'

import Reactions from '../index'

beforeEach(jest.clearAllMocks)

const givenReactions = setupTest(Reactions)({
  post: {
    ...posts.text,
    reactions: [],
  },
  author: authors[0].uid,
})

// renders a post without reactions
it('renders Reactions', () => {
  const { wrapper } = givenReactions()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles like', async () => {
  const { wrapper } = givenReactions()

  // initial state => like icon displayed
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)

  // press like button
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
  })
  // like icon must be filled
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like-fill')
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)

  // remove like
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
  })
  // like icon must be unfilled
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)
})

it('handles dislike', async () => {
  const { wrapper } = givenReactions()

  // initial state => dislike icon displayed
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.iconName).toBe('dislike')
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(0)

  // press dislike button
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'dislike-button' }).props.onPress()
  })
  // dislike icon must be filled
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.iconName).toBe('dislike-fill')
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(1)

  // remove dislike
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'dislike-button' }).props.onPress()
  })
  // dislike icon must be unfilled
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.iconName).toBe('dislike')
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(0)
})

it('toggles reaction', async () => {
  const { wrapper } = givenReactions()

  // initial state
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.iconName).toBe('dislike')

  // press like button
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(0)

  // press dislike button
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'dislike-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(1)

  // press dislike button again
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'dislike-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)
  expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(0)
})

describe('handles comments', () => {
  test('navigation', () => {
    const { wrapper } = givenReactions()
    act(() => {
      wrapper.root.findByProps({ testID: 'comment-button' }).props.onPress()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.COMMENTS, expect.anything())
  })
  test('onPresscustom handler', () => {
    const { wrapper, props } = givenReactions({
      onComment: jest.fn(),
    })
    act(() => {
      wrapper.root.findByProps({ testID: 'comment-button' }).props.onPress()
    })
    expect(useNavigation().navigate).toBeCalledTimes(0)
    expect(props.onComment).toBeCalledTimes(1)
  })
})

jest.mock('@expo/react-native-action-sheet', () => ({
  useActionSheet: jest.fn().mockReturnValue({
    showActionSheetWithOptions: jest.fn(),
  }),
}))

it('handles sharing', () => {
  const { wrapper } = givenReactions()
  act(() => {
    wrapper.root.findByProps({ testID: 'share-button' }).props.onPress()
  })
  expect(useActionSheet().showActionSheetWithOptions).toBeCalledTimes(1)
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})
