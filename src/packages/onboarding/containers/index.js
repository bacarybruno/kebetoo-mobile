import React, { useCallback, useState, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'

import Text from 'Kebetoo/src/shared/components/text'
import IconButton from 'Kebetoo/src/shared/components/buttons/icon'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import OnbordingSlide from 'Kebetoo/src/packages/onboarding/components'
import routes from 'Kebetoo/src/navigation/routes'
import images from 'Kebetoo/src/theme/images'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

export const routeOptions = { headerShown: false }

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

export const SkipButton = ({ onPress }) => (
  <TouchableOpacity style={styles.skipButton} onPress={onPress}>
    <Text color="grey" text={strings.general.skip} />
  </TouchableOpacity>
)

const OnboardingPage = ({ navigation }) => {
  const [slideIndex, setSlideIndex] = useState(0)
  const swiperRef = useRef()
  const isLastSlideItem = slideItems.length - 1 === slideIndex

  const onSlideIndexChanged = useCallback((index) => {
    setSlideIndex(index)
  }, [setSlideIndex])

  const onSlideNext = useCallback(() => {
    swiperRef.current.scrollBy(1)
  }, [swiperRef])

  const onGetStarted = useCallback(() => {
    navigation.navigate(routes.SIGNUP)
  }, [navigation])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.skipButtonWrapper}>
          {!isLastSlideItem && <SkipButton onPress={onGetStarted} />}
        </View>
        <Swiper
          style={styles.swiper}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.paginationStyle}
          onIndexChanged={onSlideIndexChanged}
          showsPagination={!isLastSlideItem}
          ref={swiperRef}
          scrollEnabled={false}
        >
          {slideItems.map((slideItem, index) => (
            <OnbordingSlide
              imageSrc={slideItem.imageSrc}
              slideTitle={slideItem.title}
              slideDescription={slideItem.description}
              key={`onboarding-slide-item-${index}`}
            />
          ))}
        </Swiper>
        <View style={styles.buttonWrapper}>
          {isLastSlideItem ? (
            <FullButton text={strings.general.get_started} onPress={onGetStarted} />
          ) : (
            <IconButton
              style={styles.nextButton}
              onPress={onSlideNext}
              iconName="ios-arrow-round-forward"
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default OnboardingPage
