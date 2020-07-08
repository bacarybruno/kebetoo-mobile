import { Appearance } from 'react-native'

const colorScheme = Appearance.getColorScheme()

const images = {
  onboarding1: require('Kebetoo/assets/images/onboarding1.png'),
  onboarding2: require('Kebetoo/assets/images/onboarding2.png'),
  onboarding3: require('Kebetoo/assets/images/onboarding3.png'),
  google_icon: require('Kebetoo/assets/images/google.png'),
  bottom_tab_overlay: colorScheme === 'dark'
    ? require('Kebetoo/assets/images/bottom-tab-overlay-dark.png')
    : require('Kebetoo/assets/images/bottom-tab-overlay.png'),
  logo_full: require('Kebetoo/assets/images/logo-full.png'),
  waves: require('Kebetoo/assets/images/waves.png'),
}

export default images
