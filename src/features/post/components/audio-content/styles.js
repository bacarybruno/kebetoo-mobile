import { StyleSheet } from 'react-native'

import { elevation } from '@app/theme'

export default (colors) => StyleSheet.create({
  text: {
    marginBottom: 8,
  },
  comment: {
    backgroundColor: colors.backgroundTertiary,
    ...elevation(1),
  },
})
