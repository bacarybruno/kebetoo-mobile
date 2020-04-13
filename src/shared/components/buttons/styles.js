import { StyleSheet } from 'react-native'

import Colors from 'Kebetoo/src/theme/colors'

export default StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.primary,
    color: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
})
