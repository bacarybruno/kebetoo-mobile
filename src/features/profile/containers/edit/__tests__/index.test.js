import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import { TextOutlinedInput } from '@app/shared/components/inputs/text-outlined'
import { api } from '@app/shared/services'

import EditProfile, { fieldNames } from '../index'

beforeEach(jest.clearAllMocks)

const givenEditProfile = setupTest(EditProfile)({
  route: {
    params: {
      field: 'username',
    },
  },
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
  },
})

it('renders EditProfile', () => {
  const { wrapper } = givenEditProfile()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('updates profile', async () => {
  const { wrapper, props } = givenEditProfile()
  const [displayName, username, _, bio] = wrapper.root.findAllByType(TextOutlinedInput)

  await act(async () => {
    await displayName.props.onChange('jest', fieldNames.fullName)
    await username.props.onChange('@jestuser', fieldNames.username)
    await bio.props.onChange('Hello from the test side!', fieldNames.bio)
    await wrapper.root.findByProps({ text: strings.general.save.toUpperCase() }).props.onPress()
  })

  expect(api.authors.update).toBeCalledTimes(1)
  expect(api.authors.update).toBeCalledWith(expect.any(String), {
    username: '@jestuser',
    displayName: 'jest',
    bio: 'Hello from the test side!',
  })
  expect(props.navigation.goBack).toBeCalledTimes(1)
})

it('aborts profile update if username exists', async () => {
  api.authors.getByUsername.mockResolvedValue([{ id: 'fake-id-123' }])
  const { wrapper, props } = givenEditProfile()
  const [displayName, username, _, bio] = wrapper.root.findAllByType(TextOutlinedInput)

  expect(username.props.error).toBeNull()

  await act(async () => {
    await displayName.props.onChange('jest', fieldNames.fullName)
    await username.props.onChange('@jestuser', fieldNames.username)
    await bio.props.onChange('Hello from the test side!', fieldNames.bio)
    await wrapper.root.findByProps({ text: strings.general.save.toUpperCase() }).props.onPress()
  })

  expect(api.authors.update).not.toBeCalled()
  expect(props.navigation.goBack).not.toBeCalled()
  expect(username.props.error).not.toBeNull()
})
