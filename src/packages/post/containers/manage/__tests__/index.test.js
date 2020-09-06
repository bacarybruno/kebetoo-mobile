import { act } from 'react-test-renderer'
import { fireEvent } from 'react-native-testing-library'
import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'
import * as api from 'Kebetoo/src/shared/helpers/http'
import ActionButton from 'react-native-action-button'
import routes from 'Kebetoo/src/navigation/routes'

import ManagePost from '../index'

const mockStore = configureStore()
const store = mockStore()

const givenManagePost = setupTest(ManagePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  },
  store,
})

afterEach(jest.clearAllMocks)

it('renders ManagePost', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenManagePost()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('defines page name', () => {
  const { props } = givenManagePost()
  expect(props.navigation.setOptions).toBeCalledWith(
    expect.objectContaining({
      title: strings.profile.manage_posts_title, headerShown: true,
    }),
  )
})

it('display a no-content message if there is no post', async () => {
  api.getUserPosts = jest.fn().mockResolvedValue([])
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenManagePost()
    wrapper = asyncWrapper
  })
  expect(wrapper.root.findAllByProps({ text: strings.manage_posts.no_content }).length).toBeTruthy()
})

it('navigates to post creation page on fab press', async () => {
  let props
  await act(async () => {
    const { wrapper, props: asyncProps } = await givenManagePost()
    fireEvent.press(wrapper.root.findByType(ActionButton))
    props = asyncProps
  })
  expect(props.navigation.navigate).toBeCalledTimes(1)
  expect(props.navigation.navigate).toBeCalledWith(routes.CREATE_POST, expect.anything())
})
