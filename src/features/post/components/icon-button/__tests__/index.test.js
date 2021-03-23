import { Animated } from 'react-native'

import setupTest from '@app/config/jest-setup'
import { readableSeconds } from '@app/shared/helpers/dates'

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

// TODO: find a better way to test this without having knowledge of implementation details
// ie without relying on jest.spyOn(Animated, 'spring')
describe('animation', () => {
  beforeEach(jest.clearAllMocks)
  it('animates IconButton if active', () => {
    const animateSpring = jest.spyOn(Animated, 'spring')
    givenIconButton({
      activable: true,
      isActive: true,
      text: readableSeconds(100),
    })
    // a call is already trigerred by react navigation
    expect(animateSpring).toBeCalledTimes(2)
  })
  it('doesnt animates IconButton if not active', () => {
    const animateSpring = jest.spyOn(Animated, 'spring')
    givenIconButton({
      activable: true,
      isActive: false,
      text: readableSeconds(100),
    })
    // a call is already trigerred by react navigation
    expect(animateSpring).toBeCalledTimes(1)
  })
})
