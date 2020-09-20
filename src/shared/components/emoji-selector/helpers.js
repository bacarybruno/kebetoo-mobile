import { Platform } from 'react-native'

import categories, { fullCategoryNames as categoryNames } from './categories'

const charFromUtf16 = (utf16) => String.fromCodePoint(...utf16.split('-').map((u) => `0x${u}`))
const charFromEmojiObject = (obj) => charFromUtf16(obj.unified)

// filters
const filterSupported = (emoji) => (
  !emoji.obsoleted_by
  && emoji[`has_img_${Platform.OS === 'ios' ? 'apple' : 'google'}`]
  && emoji.category !== 'Skin Tones'
)

// sort
const sortByCategory = (a, b) => (
  categoryNames.indexOf(a.category) - categoryNames.indexOf(b.category)
)
const sortBySortOrder = (a, b) => a.sort_order - b.sort_order
const sortByCategoryAndOrder = (a, b) => {
  const categorySort = sortByCategory(a, b)
  const orderSort = sortBySortOrder(a, b)
  return categorySort || orderSort
}

// map
const mapEmojis = (emoji) => ({
  symbol: charFromEmojiObject(emoji),
  shortNames: emoji.short_names,
  category: emoji.category === 'People & Body' ? 'Smileys & Emotion' : emoji.category,
})

// group
const groupByCategory = (emojis) => {
  const groups = {}
  emojis.forEach((emoji) => {
    if (groups[emoji.category] === undefined) groups[emoji.category] = []
    groups[emoji.category].push(emoji)
  })
  if (groups[categories.history.name] === undefined) groups[categories.history.name] = []
  return groups
}

// history params
const historyStorageKey = '@app/storage/emoji-history'
const historyMaxItems = 40

export default {
  sortByCategoryAndOrder,
  charFromEmojiObject,
  filterSupported,
  groupByCategory,
  mapEmojis,
  history: {
    storageKey: historyStorageKey,
    maxItems: historyMaxItems,
  },
}
