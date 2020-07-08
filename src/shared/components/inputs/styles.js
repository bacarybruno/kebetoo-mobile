import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'

import { fontSizes } from '../typography'

export const placeholderColor = colors.placeholder

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: 48,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: metrics.marginHorizontal,
  },
  textInput: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: placeholderColor,
  },
})
