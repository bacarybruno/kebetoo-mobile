import { StyleSheet } from 'react-native'
import { systemWeights } from 'react-native-typography'

export default (colors) => StyleSheet.create({
  text: {
    color: colors.textPrimary,
  },
  link: {
    color: colors.link,
  },
  bold: systemWeights.bold,
  semibold: systemWeights.semibold,
  italic: {
    fontStyle: 'italic',
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
})
