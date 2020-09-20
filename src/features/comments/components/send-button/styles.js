import { StyleSheet } from 'react-native'

import { colors, elevation } from '@app/theme'

export const bottomBarSize = 45

const defaultButtonStyle = {
  width: bottomBarSize,
  maxWidth: bottomBarSize,
  height: bottomBarSize,
  maxHeight: bottomBarSize,
  borderRadius: bottomBarSize / 2,
  marginLeft: 5,
  justifyContent: 'center',
  alignItems: 'center',
  ...elevation(2),
}

export default StyleSheet.create({
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
