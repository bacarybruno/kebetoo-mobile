import React, {
  useCallback, useState, useRef, useEffect, useMemo,
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

const routeOptions = {
  headerShown: false,
}

const createKeyword = (word) => (
  <Typography
    type={Typography.types.subheading}
    systemWeight={Typography.weights.semibold}
    text={word}
    color="black"
  />
)

const withKeyword = (string, keyword) => (
  strings.formatString(string, createKeyword(keyword))
)

export const slideItems = [{
  imageSrc: images.onboarding1,
  title: strings.onboarding.screen_one_title,
  description: withKeyword(
    strings.onboarding.screen_one_description,
    strings.onboarding.keyword_african_dna,
  ),
}, {
  imageSrc: images.onboarding2,
  title: strings.onboarding.screen_two_title,
  description: withKeyword(
    strings.onboarding.screen_two_description,
    strings.onboarding.keyword_voice_messages,
  ),
}, {
  imageSrc: images.onboarding3,
  title: strings.onboarding.screen_three_title,
  description: withKeyword(
    strings.onboarding.screen_three_description,
    strings.onboarding.keyword_simple_intuitive,
  ),
}]

export const SkipButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <TouchableOpacity style={styles.skipButton} onPress={onPress}>
      <Typography
        type={Typography.types.textButton}
        systemWeight={Typography.weights.light}
        color="black"
        text={strings.general.skip}
      />
    </TouchableOpacity>
  )
}

const OnboardingPage = ({ navigation }) => {
  navigation.setOptions(routeOptions)
  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()

  const [slideIndex, setSlideIndex] = useState(0)
  const swiperRef = useRef()
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

  const slides = useMemo(() => (
    slideItems.map((slideItem, index) => (
      <OnbordingSlide
        slideTitle={slideItem.title}
        slideDescription={slideItem.description}
        key={`onboarding-slide-item-${index}`}
      />
    ))
  ), [])

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
              iconName="arrow-forward"
              testID="next-button"
            />
          )}
        </View>
      </View>
    </ImageBackground>
  )
}

export default React.memo(OnboardingPage)
