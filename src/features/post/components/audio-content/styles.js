import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import elevation from '@app/theme/elevation'

export default StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  comment: {
    backgroundColor: colors.backgroundTertiary,
    ...elevation(1),
  },
})
