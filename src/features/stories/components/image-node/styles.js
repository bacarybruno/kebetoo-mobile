import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sticker: {
    width: 100,
    height: 100,
  },
})