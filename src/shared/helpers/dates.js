import dayjs from 'dayjs'

export const readableSeconds = (value) => {
  const date = dayjs().startOf('day').second(value)
  return date.format('mm:ss')
}