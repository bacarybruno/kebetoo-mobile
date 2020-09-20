import { StyleSheet } from 'react-native'

import { colors, metrics } from '@app/theme'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal * 2,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
  },
})
