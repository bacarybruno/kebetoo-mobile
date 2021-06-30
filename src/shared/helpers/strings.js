export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  const splitCharacters = '. '
  const parts = s.split(splitCharacters)
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(splitCharacters)
}


export const readableNumber = (number) => {
  if (number < 1e3) return number
  if (number >= 1e3 && number < 1e6) return `${parseFloat((number / 1e3).toFixed(1))}K`
  if (number >= 1e6 && number < 1e9) return `${parseFloat((number / 1e6).toFixed(1))}M`
  if (number >= 1e9 && number < 1e12) return `${parseFloat((number / 1e9).toFixed(1))}B`
  if (number >= 1e12) return `${parseFloat((number / 1e12).toFixed(1))}T`
  return null
}
