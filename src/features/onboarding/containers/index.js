import {
  memo, useCallback, useState, useRef, useEffect, useMemo, useContext,
} from 'react';
import {
  View, TouchableOpacity, ImageBackground, StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import { IconButton, FullButton, Typography } from '@app/shared/components';
import OnbordingSlide from '@app/features/onboarding/components';
import routes from '@app/navigation/routes';
import { images } from '@app/theme';
import { useAnalytics, useAppColors, useAppStyles } from '@app/shared/hooks';
import { strings } from '@app/config';
import { SafeAreaContext } from '@app/shared/contexts';


import createThemedStyles from './styles';

const routeOptions = {
  headerShown: false,
};

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
}];

export const SkipButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <TouchableOpacity style={styles.skipButton} onPress={onPress}>
      <Typography
        type={Typography.types.textButton}
        systemWeight={Typography.weights.light}
        color="black"
        text={strings.general.skip}
      />
    </TouchableOpacity>
  );
};

const OnboardingPage = ({ navigation }) => {
  navigation.setOptions(routeOptions);
  const styles = useAppStyles(createThemedStyles);
  const { colors, resetAppBars } = useAppColors();
  const [slideIndex, setSlideIndex] = useState(0);
  const swiperRef = useRef();
  const isLastSlideItem = slideItems.length - 1 === slideIndex;
  const { trackOnboardingStart, trackOnboardingEnd } = useAnalytics();
  const {
    updateTopSafeAreaColor, updateBottomSafeAreaColor, resetStatusBars,
  } = useContext(SafeAreaContext);

  useEffect(() => {
    updateTopSafeAreaColor(colors.onboarding);
    updateBottomSafeAreaColor(colors.onboarding);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackOnboardingStart();

    const removeFocusListener = navigation.addListener('focus', () => {
      StatusBar.setBackgroundColor(colors.onboarding);
      changeNavigationBarColor(colors.onboarding);
      StatusBar.setBarStyle('dark-content');
    });
    const removeBlurListener = navigation.addListener('blur', resetAppBars);
    return () => {
      removeFocusListener();
      removeBlurListener();
    };
  }, [colors.onboarding, navigation, resetAppBars, trackOnboardingStart]);

  const onSlideNext = useCallback(() => {
    swiperRef.current.scrollBy(1);
  }, [swiperRef]);

  const onGetStarted = useCallback(() => {
    trackOnboardingEnd();
    resetStatusBars();
    navigation.navigate(routes.SIGNUP);
  }, [navigation, resetStatusBars, trackOnboardingEnd]);

  const slides = useMemo(() => (
    slideItems.map((slideItem, index) => (
      <OnbordingSlide
        slideTitle={slideItem.title}
        slideDescription={slideItem.description}
        key={`onboarding-slide-item-${index}`}
      />
    ))
  ), []);

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
          {isLastSlideItem && (
            <FullButton
              text={strings.general.get_started}
              onPress={onGetStarted}
            />
          )}
          {!isLastSlideItem && (
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
  );
};

export default memo(OnboardingPage);
