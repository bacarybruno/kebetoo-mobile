import React, {
  useCallback, useState, useRef, useEffect,
} from 'react'
import {
  View, TouchableOpacity, ImageBackground, StatusBar,
} from 'react-native'
import Swiper from 'react-native-swiper'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { IconButton, FullButton, Typography } from '@app/shared/components'
import OnbordingSlide from '@app/features/onboarding/components'
import routes from '@app/navigation/routes'
import { images } from '@app/theme'
import { useAnalytics, useAppColors, useAppStyles } from '@app/shared/hooks'
import { strings } from '@app/config'

import createThemedStyles from './styles'

export const slideItems = [{
  imageSrc: images.onboarding1,
  title: strings.onboarding.screen_one_title,
  description: strings.onboarding.screen_one_description,
}, {
  imageSrc: images.onboarding2,
  title: strings.onboarding.screen_two_title,
  description: strings.onboarding.screen_two_description,
}, {
  imageSrc: images.onboarding3,
  title: strings.onboarding.screen_three_title,
  description: strings.onboarding.screen_three_description,
}]

export const SkipButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <TouchableOpacity style={styles.skipButton} onPress={onPress}>
      <Typography
        type={Typography.types.textButton}
        color={Typography.colors.secondary}
        text={strings.general.skip}
      />
    </TouchableOpacity>
  )
}

const OnboardingPage = ({ navigation }) => {
  navigation.setOptions({ headerShown: false })
  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()

  const [slideIndex, setSlideIndex] = useState(0)
  const swiperRef = useRef()
  const [slides, setSlides] = useState([])
  const isLastSlideItem = slideItems.length - 1 === slideIndex
  const { trackOnboardingStart, trackOnboardingEnd } = useAnalytics()

  useEffect(() => {
    trackOnboardingStart()

    const removeFocusListener = navigation.addListener('focus', () => {
      StatusBar.setBackgroundColor(colors.onboarding)
      changeNavigationBarColor(colors.onboarding)
    })
    const removeBlurListener = navigation.addListener('blur', resetAppBars)
    return () => {
      removeFocusListener()
      removeBlurListener()
    }
  }, [])

  const onSlideNext = useCallback(() => {
    swiperRef.current.scrollBy(1)
  }, [swiperRef])

  const onGetStarted = useCallback(() => {
    trackOnboardingEnd()
    navigation.navigate(routes.SIGNUP)
  }, [navigation, trackOnboardingEnd])

  useEffect(() => {
    setSlides(
      slideItems.map((slideItem, index) => (
        <OnbordingSlide
          slideTitle={slideItem.title}
          slideDescription={slideItem.description}
          key={`onboarding-slide-item-${index}`}
        />
      )),
    )
  }, [])

  return (
    <ImageBackground source={slideItems[slideIndex].imageSrc} style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.skipButtonWrapper}>
          {!isLastSlideItem && <SkipButton onPress={onGetStarted} />}
        </View>
        <Swiper
          style={styles.swiper}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.paginationStyle}
          onIndexChanged={setSlideIndex}
          showsPagination={!isLastSlideItem}
          ref={swiperRef}
          scrollEnabled={false}
          testID="swiper"
        >
          {slides}
        </Swiper>
        <View style={styles.buttonWrapper}>
          {isLastSlideItem ? (
            <FullButton text={strings.general.get_started} onPress={onGetStarted} />
          ) : (
            <IconButton
              style={styles.nextButton}
              onPress={onSlideNext}
              iconName="ios-arrow-round-forward"
              testID="next-button"
            />
          )}
        </View>
      </View>
    </ImageBackground>
  )
}

export default React.memo(OnboardingPage)
