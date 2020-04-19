import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

const size = 56
export default StyleSheet.create({
  wrapper: {
    width: size,
    height: size,
    marginBottom: size / 2,
  },
  container: {
    width: '100%',
    height: '100%',
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // shadow / elevation
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
})