import dayjs from 'dayjs'

export const readableSeconds = (value) => {
  const date = dayjs().startOf('day').second(value)
  if (!date.isValid?.()) return '0:00'
  return date.format('m:ss')
}