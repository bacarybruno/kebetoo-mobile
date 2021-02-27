import { Alert } from 'react-native'

import { strings } from '@app/config'
import setupTest from '@app/config/jest-setup'

import LanguagesPage from '../index'

beforeEach(jest.clearAllMocks)

const givenLanguagesPage = setupTest(LanguagesPage)()

it('renders LanguagesPage', () => {
  const { wrapper } = givenLanguagesPage()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('updates language', () => {
  Alert.alert = jest.fn()
  const { wrapper } = givenLanguagesPage()
  const saveButton = wrapper.root.findByProps({ text: strings.general.save.toUpperCase() })
  saveButton.props.onPress()
  expect(Alert.alert).toBeCalledTimes(1)
  expect(Alert.alert.mock.calls).toMatchSnapshot()
})