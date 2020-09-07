import { act } from 'react-test-renderer'
import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'

import Comments from '../index'

jest.mock('@react-navigation/native', () => {
  const posts = require('Kebetoo/__fixtures__/posts').default
  return {
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => ({
      params: {
        post: posts.audio,
      },
    }),
    useNavigation: () => ({
      navigate: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(),
    }),
  }
})

beforeEach(jest.clearAllMocks)

const mockStore = configureStore()
const store = mockStore()

const givenComments = setupTest(Comments)({ store })

it('renders Comments', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders Comments in loading state', () => {
  let wrapper
  act(() => {
    const { wrapper: asyncWrapper } = givenComments()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders sendbutton if there is a comment', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  const textInput = wrapper.root.findByProps({ placeholder: strings.comments.add_comment })
  act(() => {
    textInput.props.onValueChange('New comment')
  })
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeTruthy()
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'send-button' }).props.onPress()
  })
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeFalsy()
})
