import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'
import elevation from '@app/theme/elevation'

export default StyleSheet.create({
  headerStyle: {
    ...elevation(0),
    shadowOpacity: 0,
    backgroundColor: colors.background,
  },
  tabBar: {
    ...elevation(0),
    height: metrics.tabBarHeight,
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    paddingBottom: 10,
  },
  bottomTabOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: metrics.tabBarFullHeight,
    width: '100%',
    resizeMode: 'stretch',
  },
})
