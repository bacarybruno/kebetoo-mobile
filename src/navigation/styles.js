import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: colors.background,
  },
  tabBar: {
    height: metrics.tabBarHeight,
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    paddingBottom: 10,
  },
  bottomTabOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 90,
    width: '100%',
    resizeMode: 'stretch',
  },
})
