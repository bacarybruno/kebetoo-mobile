import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

export const bottomBarSize = 45
export default StyleSheet.create({
  flexible: {
    flex: 1,
  },
  audio: {
    marginTop: 5,
    height: 45,
    backgroundColor: colors.white_darken,
  },
  reactionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'flex-end',
  },
  reactionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarWrapper: {
    marginRight: 10,
  },
})
