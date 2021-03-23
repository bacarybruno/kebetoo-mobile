import { StyleSheet } from 'react-native'

export default (colors) => StyleSheet.create({
  link: {
    color: colors.link,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
})
