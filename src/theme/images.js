import { Appearance } from 'react-native'

const colorScheme = Appearance.getColorScheme()

const images = {
  onboarding1: require('@assets/images/onboarding1.png'),
  onboarding2: require('@assets/images/onboarding2.png'),
  onboarding3: require('@assets/images/onboarding3.png'),
  google_icon: require('@assets/images/google.png'),
  bottom_tab_overlay: colorScheme === 'dark'
    ? require('@assets/images/bottom-tab-overlay-dark.png')
    : require('@assets/images/bottom-tab-overlay.png'),
  logo_full: require('@assets/images/logo-full.png'),
  waves: require('@assets/images/waves.png'),
}

export default images
