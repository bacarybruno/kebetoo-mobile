import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import elevation from 'Kebetoo/src/theme/elevation'

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    ...elevation(2),
  },
})
