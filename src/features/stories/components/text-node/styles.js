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
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: metrics.screenWidth / 1.2,
  },
  box: {
    padding: metrics.spacing.sm,
    borderRadius: metrics.radius.sm,
  },
  text: {
    textAlign: 'center',
  },
  centeredText: {
    left: 0,
    alignSelf: 'center',
  }
})