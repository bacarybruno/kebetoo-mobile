import { StyleSheet } from 'react-native'

import colors, { hexToRgba, rgbaToHex } from '@app/theme/colors'
import elevation from '@app/theme/elevation'
import metrics from '@app/theme/metrics'

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
