import { act } from 'react-test-renderer'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import { api } from '@app/shared/services'
import ActionButton from 'react-native-action-button'
import routes from '@app/navigation/routes'
import audioPost from '@fixtures/posts/audio'
import { useActionSheet } from '@expo/react-native-action-sheet'

import ManagePost from '../index'
import BasicPost from '../../basic-post'
import { actionTypes } from '../../create'

beforeEach(jest.clearAllMocks)

const givenManagePost = setupTest(ManagePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  },
  route: {
    params: null,
  },
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
  expect(props.navigation.setOptions).toBeCalledWith({
    title: strings.manage_posts.my_posts,
    headerShown: false,
  })
})

it('display a no-content message if there is no post', async () => {
  api.posts.getByAuthor.mockResolvedValue([])
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

jest.mock('@expo/react-native-action-sheet', () => ({
  useActionSheet: jest.fn().mockReturnValue({
    showActionSheetWithOptions: jest.fn(),
  }),
}))

describe('post options', () => {
  it('navigates on post edit', async () => {
    let wrapper
    let props
    const userPosts = [audioPost]
    api.posts.getByAuthor.mockResolvedValue(userPosts)
    await act(async () => {
      const { wrapper: asyncWrapper, props: asyncProps } = await givenManagePost()
      wrapper = asyncWrapper
      props = asyncProps
    })
    act(() => {
      wrapper.root.findAllByType(BasicPost)[0].props.onOptions()
    })
    expect(useActionSheet().showActionSheetWithOptions).toBeCalledTimes(1)
    expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
    await useActionSheet().showActionSheetWithOptions.mock.calls[0][1](0)
    expect(props.navigation.navigate).toBeCalledTimes(1)
    expect(props.navigation.navigate).toBeCalledWith(routes.CREATE_POST, {
      action: actionTypes.EDIT,
      payload: expect.any(Object),
      onGoBack: expect.any(Function),
    })
  })
  it('doesnt navigate on post delete', async () => {
    let wrapper
    let props
    const userPosts = [audioPost]
    api.posts.getByAuthor.mockResolvedValue(userPosts)
    await act(async () => {
      const { wrapper: asyncWrapper, props: asyncProps } = await givenManagePost()
      wrapper = asyncWrapper
      props = asyncProps
    })
    act(() => {
      wrapper.root.findAllByType(BasicPost)[0].props.onOptions()
    })
    expect(useActionSheet().showActionSheetWithOptions).toBeCalledTimes(1)
    useActionSheet().showActionSheetWithOptions.mock.calls[0][1](1)
    expect(props.navigation.navigate).not.toBeCalledTimes(1)
  })
})
