import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export const bottomBarSize = 45

const defaultButtonStyle = {
  width: bottomBarSize,
  maxWidth: bottomBarSize,
  height: bottomBarSize,
  maxHeight: bottomBarSize,
  borderRadius: metrics.radius.round,
  marginLeft: metrics.spacing.sm,
  justifyContent: 'center',
  alignItems: 'center',
  ...elevation(2),
}

export default (colors) => StyleSheet.create({
  send: {
    ...defaultButtonStyle,
    backgroundColor: colors.primary,
  },
  recordButton: {
    ...defaultButtonStyle,
  },
  sendIcon: {
    marginLeft: bottomBarSize / 9,
  },
})
