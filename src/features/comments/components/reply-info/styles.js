import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'
import { rgbaToHex, hexToRgba } from '@app/theme/colors'

export default (colors) => StyleSheet.create({
  deleteWrapper: {
    width: 18,
    height: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  caption: {
    marginBottom: 6,
  },
  replyInfoWrapper: {
    marginHorizontal: metrics.marginHorizontal / 3,
  },
  replyInfoContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 3,
    paddingHorizontal: metrics.marginHorizontal / 2,
    paddingVertical: 10,
    backgroundColor: hexToRgba(rgbaToHex(colors.border), 0.5),
  },
  replyInfoContent: {
    flex: 1,
  },
})
