import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default StyleSheet.create({
  wrapper: {
    marginHorizontal: metrics.marginHorizontal,
    marginTop: metrics.screenHeight * 0.55,
  },
  description: {
    marginTop: metrics.screenHeight * 0.035,
  },
})
