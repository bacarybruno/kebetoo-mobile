import { act } from 'react-test-renderer'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import setupTest from '@app/config/jest-setup'
import * as api from '@app/shared/helpers/http'
import authors from '@fixtures/authors'
import { TextAvatar } from '@app/shared/components/avatar'
import routes from '@app/navigation/routes'
import audioPost from '@fixtures/posts/audio'
import BasicPost from '@app/features/post/containers/basic-post'

import UserProfile, { SectionHeader } from '../index'

const givenUserProfile = setupTest(UserProfile)({
  navigation: {
    setOptions: jest.fn(),
  },
})

it('renders UserProfile', () => {
  const { wrapper } = givenUserProfile()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('avatar', () => {
  it('renders text avatar if there is no image', async () => {
    let wrapper
    const author = {
      ...authors.find((a) => a.photoURL === null),
      posts: [],
      comments: [],
      reactions: [],
    }
    api.getAuthorById.mockResolvedValue(author)

    await act(async () => {
      const { wrapper: wrapperAsync } = await givenUserProfile()
      wrapper = wrapperAsync
    })

    expect(wrapper.root.findAllByType(TextAvatar).length).toBe(1)

    const header = wrapper.root.findByProps({ testID: 'list-header' })
    act(() => {
      header.props.onPress()
    })
    expect(useNavigation().navigate).toBeCalledTimes(0)
  })
  it('renders image avatar if there is an image', async () => {
    let wrapper
    const author = {
      ...authors.find((a) => a.photoURL !== null),
      posts: [],
      comments: [],
      reactions: [],
    }
    api.getAuthorById.mockResolvedValue(author)

    await act(async () => {
      const { wrapper: wrapperAsync } = await givenUserProfile()
      wrapper = wrapperAsync
    })

    expect(wrapper.root.findAllByType(TextAvatar).length).toBe(0)
    expect(wrapper.root.findAllByType(Image).length).toBe(1)
    expect(wrapper.root.findByType(Image).props.source).toStrictEqual({ uri: author.photoURL })

    const header = wrapper.root.findByProps({ testID: 'list-header' })
    act(() => {
      header.props.onPress()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.MODAL_IMAGE, {
      source: {
        uri: author.photoURL,
      },
    })
  })
})

describe('posts', () => {
  it('renders posts', async () => {
    let wrapper
    const author = {
      ...authors.find((a) => a.photoURL === null),
      photoURL: 'https://googleusercontent.com/picture/s96-c/image.png',
      posts: ['post-1', 'post-2'],
      comments: ['comment-1', 'comment-2'],
      reactions: ['reaction-1', 'reaction-2'],
    }
    const userPosts = [audioPost]
    api.getAuthorById.mockResolvedValue(author)
    api.getUserPosts.mockResolvedValue(userPosts)

    await act(async () => {
      const { wrapper: wrapperAsync } = await givenUserProfile()
      wrapper = wrapperAsync
    })

    expect(wrapper.root.findAllByType(BasicPost).length).toBe(userPosts.length)
    expect(wrapper.root.findAllByType(SectionHeader).length).toBeTruthy()
  })
})
