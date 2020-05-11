import { StyleSheet } from 'react-native'

import colors, { hexToRgba } from 'Kebetoo/src/theme/colors'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: hexToRgba(colors.primary, 0.8),
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 50,
  },
})