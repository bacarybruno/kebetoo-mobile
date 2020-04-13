import React, { useCallback, useState, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'

import IconButton from 'Kebetoo/src/shared/components/buttons/icon'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import OnbordingSlide from 'Kebetoo/src/packages/onboarding/components'
import routes from 'Kebetoo/src/navigation/routes'

import styles from './styles'

export const routeOptions = { headerShown: false }

export const slideItems = [{
  imageSrc: require('Kebetoo/assets/images/onboarding1.png'),
  title: 'Join Our Social Media',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: require('Kebetoo/assets/images/onboarding2.png'),
  title: 'Create Your Account',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: require('Kebetoo/assets/images/onboarding3.png'),
  title: 'Have a Fun With Your Friends',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}]

export const SkipButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.skipButton}
    onPress={onPress}
  >
    <Text style={styles.skipText}>Skip</Text>
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
