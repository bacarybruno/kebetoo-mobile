import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

export const bottomBarSize = 45
export default StyleSheet.create({
  send: {
    width: bottomBarSize,
    height: bottomBarSize,
    borderRadius: bottomBarSize / 2,
    backgroundColor: colors.input,
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
  },
  sendIcon: {
    marginLeft: bottomBarSize / 9,
    color: colors.primary,
  },
})
