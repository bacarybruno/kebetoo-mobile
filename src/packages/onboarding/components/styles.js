import { StyleSheet } from 'react-native'
import Colors from '../../../theme/colors'
import Metrics from '../../../theme/metrics'

export default StyleSheet.create({
  wrapper: {
    marginHorizontal: Metrics.marginHorizontal,
  },
  image: {
    alignSelf: 'center',
  },
  title: {
    marginTop: 70,
    fontSize: 27,
    fontWeight: 'bold',
    color: Colors.black,
  },
  description: {
    marginTop: 25,
    fontSize: 16,
    color: Colors.black,
  },
})
