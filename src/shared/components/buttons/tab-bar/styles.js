import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

const size = 71
const padding = 15
export default StyleSheet.create({
  wrapper: {
    width: size,
    height: size,
  },
  container: {
    width: size,
    height: size,
    borderRadius: size / 2,
    position: 'absolute',
    bottom: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding,
  },
  content: {
    width: size - padding,
    height: size - padding,
    borderRadius: size - padding / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
