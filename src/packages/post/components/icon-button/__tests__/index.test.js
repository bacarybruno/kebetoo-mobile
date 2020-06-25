import setupTest from 'Kebetoo/src/config/jest-setup'
import { readableSeconds } from 'Kebetoo/src/shared/helpers/dates'
import { act } from 'react-test-renderer'

import IconButton from '../index'

const givenIconButton = setupTest(IconButton)({
  onPress: jest.fn(),
  name: 'microphone',
  style: {
    elevation: 5,
  },
})

it('renders IconButton', () => {
  const { wrapper } = givenIconButton()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders activable IconButton', () => {
  let wrapper = null
  act(() => {
    const { wrapper: asyncWrapper } = givenIconButton({
      activable: true,
      isActive: true,
      text: readableSeconds(100),
    })
    wrapper = asyncWrapper
    // run all timers to fulfill animations
    jest.runAllTimers()
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
