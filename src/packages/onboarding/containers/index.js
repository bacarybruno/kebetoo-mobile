import React, { useCallback, useState, useRef } from 'react'
import { View, Text } from 'react-native'
import Swiper from 'react-native-swiper'
import styles from './styles'
import OnbordingSlide from '../components'
import IconButton from '../../shared/components/buttons/icon'
import FullButton from '../../shared/components/buttons/full'

export const routeName = 'Onboarding'
export const routeOptions = { headerShown: false }
export const slideItems = [{
  imageSrc: require('../../../../assets/images/onboarding1.png'),
  title: 'Join Our Social Media',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: require('../../../../assets/images/onboarding2.png'),
  title: 'Create Your Account',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}, {
  imageSrc: require('../../../../assets/images/onboarding3.png'),
  title: 'Have a fun With Your Friends',
  description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
}]

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
    navigation.navigate()
  }, [navigation])

  return (
    <View style={styles.wrapper}>
      <Text
        style={styles.skipTextButton}
        onPress={() => {}}
      >
        Skip
      </Text>
      <Swiper
        style={styles.swiper}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
        onIndexChanged={onSlideIndexChanged}
        showsPagination={!isLastSlideItem}
        ref={swiperRef}
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
          <IconButton style={styles.nextButton} onPress={onSlideNext} />
        )}
      </View>
    </View>
  )
}
