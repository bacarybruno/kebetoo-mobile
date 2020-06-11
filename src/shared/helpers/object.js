export const deleteProperty = (obj, property) => {
  // eslint-disable-next-line no-param-reassign
  delete obj[property]
  return { ...obj }
}

export const mergeObjects = (part1, part2) => ({
  ...part1,
  ...part2,
})

export const mergeArrays = (part1, part2) => part1.concat(part2)
