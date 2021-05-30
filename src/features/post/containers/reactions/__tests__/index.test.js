import { act } from 'react-test-renderer'
import { useNavigation } from '@react-navigation/native'
import { useActionSheet } from '@expo/react-native-action-sheet'

import setupTest from '@app/config/jest-setup'
import posts from '@fixtures/posts'
import authors from '@fixtures/authors'
import routes from '@app/navigation/routes'
import { api } from '@app/shared/services'

import Reactions, { CommentsBottomSheet } from '../index'

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
  test('bottom sheet', () => {
    const { wrapper } = givenReactions()
    act(() => {
      wrapper.root.findByProps({ testID: 'comment-button' }).props.onPress()
    })
    expect(wrapper.root.findAllByType(CommentsBottomSheet).length).toBe(1)
  })
  test('onPress custom handler', () => {
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

describe('optimistic ui update rejection', () => {
  afterEach(() => {
    api.reactions.create.mockImplementation(
      (type, postId, author) => (
        Promise.resolve({
          // eslint-disable-next-line radix
          id: parseInt(Math.random() * 1000000),
          type,
          author: {
            id: author,
          },
          post: { id: postId },
        })
      ),
    )
    api.reactions.delete.mockResolvedValue(true)
    api.reactions.update.mockResolvedValue(true)
  })
  it('fails to create reactions', async () => {
    api.reactions.create.mockRejectedValue(true)
    // api.reactions.delete.mockRejectedValue(true)

    const { wrapper } = givenReactions()

    // initial state => like icon displayed
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)

    // press like button
    await act(async () => {
      await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
    })

    // like icon remains unfilled
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)
  })
  it('fails to edit reaction', async () => {
    api.reactions.update.mockRejectedValue(true)

    const { wrapper } = givenReactions()

    // initial state => like icon displayed
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)

    // press like button
    await act(async () => {
      await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
    })

    // like icon is filled
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like-fill')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)

    // press dislike button
    await act(async () => {
      await wrapper.root.findByProps({ testID: 'dislike-button' }).props.onPress()
    })

    // dislike button remains unfilled, like button filled
    expect(wrapper.root.findByProps({ testID: 'dislike-button' }).props.count).toBe(0)
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)
  })
  it('fails to delete reaction', async () => {
    api.reactions.delete.mockRejectedValue(true)

    const { wrapper } = givenReactions()

    // initial state => like icon displayed
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(0)

    // press like button
    await act(async () => {
      await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
    })

    // like icon is filled
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like-fill')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)

    // press like button again
    await act(async () => {
      await wrapper.root.findByProps({ testID: 'like-button' }).props.onPress()
    })

    // like icon remains filled
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.iconName).toBe('like-fill')
    expect(wrapper.root.findByProps({ testID: 'like-button' }).props.count).toBe(1)
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
