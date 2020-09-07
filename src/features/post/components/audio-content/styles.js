import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import elevation from 'Kebetoo/src/theme/elevation'

export default StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  comment: {
    backgroundColor: colors.backgroundTertiary,
    ...elevation(1),
  },
})
