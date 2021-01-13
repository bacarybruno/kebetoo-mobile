import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'
import { Typography } from '@app/shared/components'

export const paginationBottom = metrics.marginVertical
export const dotHeight = 8

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.onboarding,
  },
  container: {
    flex: 1,
    marginVertical: metrics.marginVertical,
  },
  swiper: {
    marginTop: metrics.spacing.md,
  },
  dotStyle: {
    width: 8,
    height: dotHeight,
    backgroundColor: colors.inactive,
  },
  activeDotStyle: {
    width: 15,
    height: dotHeight,
    backgroundColor: colors.primary,
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
    fontSize: Typography.fontSizes.md,
    color: colors.border,
  },
})
