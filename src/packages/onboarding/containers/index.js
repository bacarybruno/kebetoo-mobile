import React, { useCallback, useState, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'

import Text from 'Kebetoo/src/shared/components/text'
import IconButton from 'Kebetoo/src/shared/components/buttons/icon'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import OnbordingSlide from 'Kebetoo/src/packages/onboarding/components'
import routes from 'Kebetoo/src/navigation/routes'
import images from 'Kebetoo/src/theme/images'

import styles from './styles'

export const routeOptions = { headerShown: false }

export const slideItems = [{
  imageSrc: images.onboarding1,
  title: 'Join Our Social Media',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: images.onboarding2,
  title: 'Create Your Account',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: images.onboarding3,
  title: 'Have a Fun With Your Friends',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}]

export const SkipButton = ({ onPress }) => (
  <TouchableOpacity style={styles.skipButton} onPress={onPress}>
    <Text color="grey" text="Skip" />
  </TouchableOpacity>
)

export default ({ navigation }) => {
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
            <FullButton text="Get Started" onPress={onGetStarted} />
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
