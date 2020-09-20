import { StyleSheet } from 'react-native'

import { colors, metrics, elevation } from '@app/theme'
import { hexToRgba, rgbaToHex } from '@app/theme/colors'

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    ...elevation(2),
  },
  disabledButton: {
    ...elevation(0),
    backgroundColor: hexToRgba(rgbaToHex(colors.primary), 0.30),
  },
  loading: {
    position: 'absolute',
    right: metrics.marginHorizontal,
  },
})
