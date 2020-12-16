import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 20,
  },
  flatlistContent: {
    paddingHorizontal: metrics.marginHorizontal,
    paddingBottom: metrics.tabBarFullHeight - metrics.tabBarHeight,
  },
})
