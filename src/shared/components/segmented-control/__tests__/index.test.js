import setupTest from '@app/config/jest-setup'
import { act } from 'react-test-renderer'

import SegmentedControl, { Segment } from '../index'

const items = [{
  label: 'Trending',
  value: 'trending',
}, {
  label: 'Recent',
  value: 'recent',
}]
const givenSegmentedControl = setupTest(SegmentedControl)({
  items,
  selectedValue: items[1].value,
  onSelect: jest.fn(),
  style: {},
})

it('renders SegmentedControl', () => {
  const { wrapper } = givenSegmentedControl()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders null if there is no item', () => {
  const { wrapper } = givenSegmentedControl({ items: [] })
  expect(wrapper.root.findAllByType(Segment).length).toBe(0)
})

it('renders as many Segment as items', () => {
  const { wrapper, props } = givenSegmentedControl()
  expect(wrapper.root.findAllByType(Segment).length).toBe(props.items.length)
})

it('selects item', () => {
  const selectedItemIndex = 0
  const { wrapper, props } = givenSegmentedControl()
  const segment = wrapper.root.findAllByType(Segment)[selectedItemIndex]
  act(() => {
    segment.props.onPress(items[selectedItemIndex])
  })
  expect(props.onSelect).toBeCalledTimes(1)
  expect(props.onSelect).toBeCalledWith(items[selectedItemIndex])
})
