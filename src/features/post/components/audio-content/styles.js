import { StyleSheet } from 'react-native'

import { colors, elevation } from '@app/theme'

export default StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  comment: {
    backgroundColor: colors.backgroundTertiary,
    ...elevation(1),
  },
})
