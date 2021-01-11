export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  const splitCharacters = '. '
  const parts = s.split(splitCharacters)
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(splitCharacters)
}


export const abbreviateNumber = (number) => {
  const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

  // what tier? (determines SI symbol)
  // eslint-disable-next-line no-bitwise
  const tier = Math.log10(number) / 3 | 0

  // if zero, we don't need a suffix
  if (tier === 0) return number

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier]
  const scale = 10 ** (tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add suffix
  return parseFloat(scaled.toFixed(1)) + suffix
}
