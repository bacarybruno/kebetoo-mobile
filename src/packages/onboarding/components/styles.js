import { StyleSheet } from 'react-native'

import Colors from 'Kebetoo/src/theme/colors'
import Metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    marginHorizontal: Metrics.marginHorizontal,
  },
  image: {
    height: Metrics.screenHeight * 0.45,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    marginTop: Metrics.screenHeight * 0.07,
    maxHeight: Metrics.screenHeight * 0.1,
    fontSize: 27,
    fontWeight: 'bold',
    color: Colors.black,
  },
  description: {
    marginTop: Metrics.screenHeight * 0.035,
    fontSize: 16,
    color: Colors.black,
  },
})
