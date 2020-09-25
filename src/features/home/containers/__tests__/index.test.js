import configureStore from 'redux-mock-store'
import { act } from 'react-test-renderer'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'

import setupTest from '@app/config/jest-setup'
import { postsList } from '@fixtures/posts'

import HomePage from '../index'

const mockStore = configureStore()
const store = mockStore({
  postsReducer: {
    posts: postsList,
  },
  userReducer: {},
})

const givenHomePage = setupTest(HomePage)({
  store,
})

beforeEach(jest.clearAllMocks)

it('renders HomePage', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenHomePage()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('search for shared file', () => {
  act(() => {
    givenHomePage()
  })
  expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(1)
  expect(ReceiveSharingIntent.clearReceivedFiles).toBeCalledTimes(1)
})
