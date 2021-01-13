import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

const imageSize = 30
export default (colors) => StyleSheet.create({
  wrapper: {
    width: imageSize,
    height: imageSize,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.round,
    backgroundColor: colors.primary,
  },
})
