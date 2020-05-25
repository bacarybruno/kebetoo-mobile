import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

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
  // elevation
  shadowColor: colors.black,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
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
