const categories = {
  history: {
    symbol: '🕘',
    name: 'Recently used',
  },
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  nature: {
    symbol: '🐻',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚽',
    name: 'Activities',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍',
    name: 'Flags',
  },
}

const categoryNames = Object.values(categories).map((category) => category.name)
const categoryIcons = Object.values(categories).map((category) => category.symbol)
const fullCategoryNames = [...categoryNames]
fullCategoryNames.splice(2, 0, 'People & Body')

export {
  categoryNames,
  categoryIcons,
  fullCategoryNames,
}
export default categories
