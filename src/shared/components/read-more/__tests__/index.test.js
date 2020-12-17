import { TouchableWithoutFeedback } from 'react-native'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'

import Typography from '../../typography'
import ReadMore, { Reveal } from '../index'

describe('ReadMore', () => {
  const givenReadMore = setupTest(ReadMore)({
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
    numberOfLines: 1,
    type: Typography.types.body,
  })

  it('renders ReadMore', () => {
    const { wrapper } = givenReadMore()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})

describe('Reveal', () => {
  const givenReveal = setupTest(Reveal)({
    text: 'read more',
    onPress: jest.fn(),
  })

  it('renders Reveal', () => {
    const { wrapper } = givenReveal()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('handles Reveal press', () => {
    const { wrapper, props } = givenReveal()
    fireEvent.press(wrapper.root.findByType(TouchableWithoutFeedback))
    expect(props.onPress).toBeCalledTimes(1)
  })
})
