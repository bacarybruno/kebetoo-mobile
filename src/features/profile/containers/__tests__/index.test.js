import { Share } from 'react-native'
import configureStore from 'redux-mock-store'
import { act, fireEvent } from 'react-native-testing-library'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import { api } from '@app/shared/services'
import routes from '@app/navigation/routes'

import Profile from '../index'

const mockStore = configureStore()
const store = mockStore({
  userReducer: {
    stats: {
      posts: 100,
      comments: 100,
      reactions: 100,
    },
    profile: auth().currentUser,
  },
})

const givenProfile = setupTest(Profile)({
  store,
})

it('renders Profile', async () => {
  let wrapper = null
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenProfile()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('displays the right stats for', () => {
  const { stats } = store.getState().userReducer
  const statsItems = [{
    name: 'posts',
    title: strings.profile.posts.toLowerCase(),
    value: stats.posts,
    resolvedValue: 10,
  }, {
    name: 'comments',
    title: strings.profile.comments.toLowerCase(),
    value: stats.comments,
    resolvedValue: 100,
  }, {
    name: 'reactions',
    title: strings.profile.reactions.toLowerCase(),
    value: stats.reactions,
    resolvedValue: 1000,
  }]
  statsItems.forEach((item) => {
    it(`[${item.name}]: when request is resolved`, async () => {
      api.posts.countByAuthor.mockResolvedValue(item.resolvedValue)
      api.comments.countByAuthor.mockResolvedValue(item.resolvedValue)
      api.reactions.countByAuthor.mockResolvedValue(item.resolvedValue)
      let wrapper = null
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenProfile()
        wrapper = asyncWrapper
      })
      expect(wrapper.root.findByProps({ title: item.title }).props.value).toBe(item.resolvedValue)
    })
    it(`[${item.name}]: when request fails`, async () => {
      api.posts.countByAuthor.mockRejectedValue()
      api.comments.countByAuthor.mockRejectedValue()
      api.reactions.countByAuthor.mockRejectedValue()
      let wrapper = null
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenProfile()
        wrapper = asyncWrapper
      })
      expect(wrapper.root.findByProps({ title: item.title }).props.value).toBe(item.value)
    })
  })
})

describe('buttons', () => {
  it('navigates to manage-post page', async () => {
    let wrapper = null
    const { navigate } = useNavigation()
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile()
      wrapper = asyncWrapper
    })
    fireEvent.press(wrapper.root.findByProps({ text: strings.profile.manage_posts_title }))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith(routes.MANAGE_POSTS)
  })
  it('signout user', async () => {
    let wrapper = null
    const { signOut } = auth()
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile()
      wrapper = asyncWrapper
    })
    await fireEvent.press(wrapper.root.findByProps({ text: strings.profile.signout }))
    await expect(signOut).toBeCalledTimes(1)
  })
  it('shares the app', async () => {
    let wrapper = null
    Share.share = jest.fn()
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile()
      wrapper = asyncWrapper
    })
    fireEvent.press(wrapper.root.findByProps({ text: strings.profile.invite_fiend_title }))
    expect(Share.share).toBeCalledTimes(1)
  })
})
