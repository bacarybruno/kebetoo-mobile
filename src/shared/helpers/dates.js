import moment from 'moment'

export const readableSeconds = (value) => {
  const date = moment().startOf('day').seconds(value)
  return date.format('mm:ss')
}