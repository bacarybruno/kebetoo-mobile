import { StyleSheet } from 'react-native'

import { colors } from '@app/theme'

const styles = StyleSheet.create({
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

export default styles
