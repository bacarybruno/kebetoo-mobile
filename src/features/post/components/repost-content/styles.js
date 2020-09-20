import { StyleSheet } from 'react-native'

import { colors, metrics } from '@app/theme'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    minHeight: 52,
    marginVertical: 8,
    borderLeftWidth: 2,
    borderColor: colors.border,
    paddingLeft: metrics.marginHorizontal / 2,
  },
  imageContent: {
    paddingLeft: 0,
    borderLeftWidth: 0,
  },
})
