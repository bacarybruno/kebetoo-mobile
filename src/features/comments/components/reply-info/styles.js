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
    borderRadius: metrics.radius.round,
  },
  caption: {
    marginBottom: metrics.spacing.xs,
  },
  replyInfoContainer: {
    flexDirection: 'row',
    borderRadius: metrics.radius.sm,
    marginTop: metrics.spacing.sm,
    borderLeftWidth: 3,
    paddingHorizontal: metrics.marginHorizontal / 2,
    paddingVertical: metrics.spacing.sm,
    backgroundColor: hexToRgba(rgbaToHex(colors.border), 0.5),
  },
  replyInfoContent: {
    flex: 1,
  },
})
