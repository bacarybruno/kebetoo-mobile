import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'
import routes from '@app/navigation/routes'

import CreatePost, { actionTypes, ImagePreviewer } from '../index'

const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn().mockImplementation((params) => {
      if (params.headerRight) params.headerRight()
    }),
    dispatch: jest.fn(),
    addListener: jest.fn().mockImplementation((event, callback) => { callback(); return jest.fn() })
  },
  route: {
    params: {
      action: actionTypes.CREATE,
      sharedFile: 'fake-image.png',
      sharedText: 'hello world',
      payload: {
        content: 'hello content',
      },
    },
  },
})

it('renders CreatePost', () => {
  const { wrapper } = givenCreatePost()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders CreatePost with report mode', () => {
  const { wrapper } = givenCreatePost({
    route: {
      params: {
        action: actionTypes.REPORT,
      },
    },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('displays image preview', () => {
  let wrapper
  let props
  act(() => {
    const created = givenCreatePost()
    wrapper = created.wrapper
    props = created.props
  })
  fireEvent.press(wrapper.root.findByType(ImagePreviewer))
  expect(props.navigation.navigate).toBeCalledTimes(1)
  expect(props.navigation.navigate).toBeCalledWith(routes.MODAL_IMAGE, {
    source: {
      uri: expect.any(String),
    },
  })
})
