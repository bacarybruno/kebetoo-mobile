import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'
import { fontSizes } from '@app/shared/components/typography'

export const paginationBottom = metrics.marginVertical
export const dotHeight = 8

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    marginVertical: metrics.marginVertical,
  },
  swiper: {
    marginTop: 11,
  },
  dotStyle: {
    width: 8,
    height: dotHeight,
    backgroundColor: colors.inactive,
  },
  activeDotStyle: {
    width: 15,
    height: dotHeight,
    backgroundColor: colors.textPrimary,
  },
  paginationStyle: {
    marginHorizontal: metrics.marginHorizontal,
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    position: 'absolute',
    width: metrics.screenWidth - (metrics.marginHorizontal * 2),
    right: metrics.marginHorizontal,
    bottom: dotHeight,
  },
  nextButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  skipButtonWrapper: {
    // marginTop: metrics.mar,
  },
  skipButton: {
    marginHorizontal: metrics.marginHorizontal,
    alignSelf: 'flex-end',
  },
  skipText: {
    fontSize: fontSizes.md,
    color: colors.border,
  },
})
