import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'
import routes from '@app/navigation/routes'

import CreatePost, { actionTypes, VideoPreviewer } from '../index'

const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn().mockImplementation((params) => {
      if (params.headerRight) params.headerRight()
    }),
    dispatch: jest.fn(),
    addListener: jest.fn().mockImplementation((e, callback) => { callback(); return jest.fn() }),
  },
  route: {
    params: {
      action: actionTypes.EDIT,
      payload: {
        content: 'Hello',
      },
      file: 'fake-video.mp4',
    },
  },
})

it('renders VideoPreviewer if post has video file', () => {
  let wrapper
  let props
  act(() => {
    const created = givenCreatePost()
    wrapper = created.wrapper
    props = created.props
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
  expect(wrapper.root.findAllByType(VideoPreviewer).length).toBe(1)
  fireEvent.press(wrapper.root.findByType(VideoPreviewer))
  expect(props.navigation.navigate).toBeCalledWith(routes.MODAL_VIDEO, {
    source: expect.any(String),
    poster: null,
  })
})
