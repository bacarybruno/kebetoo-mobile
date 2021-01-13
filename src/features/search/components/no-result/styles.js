import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal * 2,
  },
  title: {
    fontSize: 40,
    marginBottom: metrics.spacing.sm,
  },
  message: {
    textAlign: 'center',
  },
})
