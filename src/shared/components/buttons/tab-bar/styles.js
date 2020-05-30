import { StyleSheet } from 'react-native'
import metrics from 'Kebetoo/src/theme/metrics'

export const size = 56
export default StyleSheet.create({
  wrapper: {
    width: size,
    height: size,
    bottom: metrics.tabBarHeight / 4,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
  },
  fab: {
    fontSize: 30,
  },
})
