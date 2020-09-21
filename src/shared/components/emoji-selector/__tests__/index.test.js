import { act } from 'react-test-renderer'
import configureStore from 'redux-mock-store'

import setupTest from '@app/config/jest-setup'

import EmojiSelector, { Emoji, EmojiTab } from '../index'

import { categoryNames } from '../categories'

const mockStore = configureStore()
const store = mockStore({
  appReducer: {
    emojiHistory: [{
      count: 1, symbol: '😀', addedOn: Date.now(),
    }, {
      count: 2, symbol: '🦁', addedOn: Date.now(),
    }],
  },
})
const emptyStore = mockStore({
  appReducer: {
    emojiHistory: [],
  },
})

const givenEmojiSelector = setupTest(EmojiSelector)({
  onSelectItem: jest.fn(),
  store,
})

const givenEmptyStateEmojiSelector = setupTest(EmojiSelector)({
  onSelectItem: jest.fn(),
  store: emptyStore,
})

it('renders EmojiSelector', () => {
  const { wrapper } = givenEmojiSelector()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders EmojiSelector without history', () => {
  const { wrapper } = givenEmptyStateEmojiSelector()
  expect(wrapper.root.findByProps({ testID: 'emoji-list' }).props.initialScrollIndex).toBe(1)
})

it('renders all tabs headers', () => {
  const { wrapper } = givenEmojiSelector()
  expect(wrapper.root.findAllByType(EmojiTab).length).toBe(categoryNames.length)
})

it('switches tabs', () => {
  const { wrapper } = givenEmojiSelector()
  const tabIndex = 1
  act(() => {
    wrapper.root.findByProps({ testID: `emoji-tab-${tabIndex}` }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'emoji-list' }).props.initialScrollIndex).toBe(tabIndex)
})

it('selects emoji', () => {
  const { wrapper, props } = givenEmojiSelector()
  wrapper.root.findAllByType(Emoji)[0].props.onPress('😀')
  expect(props.onSelectItem).toBeCalledTimes(1)
  expect(props.onSelectItem).toBeCalledWith('😀')
})