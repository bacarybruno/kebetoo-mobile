import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'

export default StyleSheet.create({
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: 60,
    height: 5,
    borderRadius: 5,
    margin: 10,
    backgroundColor: colors.border,
  },
})
