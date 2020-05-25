import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

export const bottomBarSize = 45
export default StyleSheet.create({
  flexible: {
    flex: 1,
  },
  loveIcon: {
    paddingLeft: 10,
  },
  audio: {
    marginTop: 5,
    height: 48,
    backgroundColor: colors.white_darken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8E8',
  },
})
