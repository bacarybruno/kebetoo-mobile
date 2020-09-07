import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    marginHorizontal: metrics.marginHorizontal,
  },
  image: {
    height: metrics.screenHeight * 0.45,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    marginTop: metrics.screenHeight * 0.07,
    // maxHeight: metrics.screenHeight * 0.1,
  },
  description: {
    marginTop: metrics.screenHeight * 0.035,
  },
})
