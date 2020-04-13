import { StyleSheet } from 'react-native'

import Colors from 'Kebetoo/src/theme/colors'
import Metrics from 'Kebetoo/src/theme/metrics'

export const paginationBottom = Metrics.marginVertical
export const dotHeight = 8

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    marginVertical: Metrics.marginVertical,
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
  },
  buttonWrapper: {
    position: 'absolute',
    width: Metrics.screenWidth - (Metrics.marginHorizontal * 2),
    right: Metrics.marginHorizontal,
    bottom: dotHeight,
  },
  nextButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  skipButtonWrapper: {
    // marginTop: Metrics.mar,
  },
  skipButton: {
    marginHorizontal: Metrics.marginHorizontal,
    alignSelf: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    color: Colors.grey,
  },
})
