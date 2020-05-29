import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import elevation from 'Kebetoo/src/theme/elevation'

export const getDimensions = (size) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
})

export const getIconSize = (size) => size / 2.22

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    ...elevation(10),
  },
  badge: {
    marginRight: 30,
  },
})
