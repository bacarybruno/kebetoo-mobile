import { StyleSheet } from 'react-native'
import Colors from '../../../theme/colors'
import Metrics from '../../../theme/metrics'

export const paginationBottom = 50
export const dotHeight = 8

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  swiper: {
    marginTop: 11,
  },
  dotStyle: {
    width: 8,
    height: dotHeight,
    backgroundColor: Colors.inactive,
  },
  activeDotStyle: {
    width: 15,
    height: dotHeight,
    backgroundColor: Colors.black,
  },
  paginationStyle: {
    marginHorizontal: Metrics.marginHorizontal,
    justifyContent: 'flex-start',
    bottom: paginationBottom,
  },
  buttonWrapper: {
    position: 'absolute',
    width: Metrics.screenWidth - (Metrics.marginHorizontal * 2),
    right: Metrics.marginHorizontal,
    bottom: (paginationBottom / 2) + dotHeight,
  },
  nextButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  skipTextButton: {
    fontSize: 16,
    color: Colors.grey,
    marginHorizontal: Metrics.marginHorizontal,
    textAlign: 'right',
    marginTop: 20,
  },
})
