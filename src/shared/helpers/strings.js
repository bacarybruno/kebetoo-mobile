export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  const splitCharacters = '. '
  const parts = s.split(splitCharacters)
  return parts
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(splitCharacters)
}
