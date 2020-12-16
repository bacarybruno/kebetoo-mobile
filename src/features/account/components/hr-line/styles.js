import { StyleSheet } from 'react-native'

export default (colors) => StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  text: {
    marginHorizontal: 10,
  },
})
