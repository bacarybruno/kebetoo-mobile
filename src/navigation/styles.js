import { StyleSheet } from 'react-native'

import { metrics, elevation } from '@app/theme'

export default (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    paddingBottom: metrics.spacing.sm,
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
