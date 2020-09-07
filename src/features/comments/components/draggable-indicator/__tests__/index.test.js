import setupTest from '@app/config/jest-setup'

import DraggableIndicator from '../index'

const givenDraggableIndicator = setupTest(DraggableIndicator)()

it('renders DraggableIndicator', () => {
  const { wrapper } = givenDraggableIndicator()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
