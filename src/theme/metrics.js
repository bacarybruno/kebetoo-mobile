import { Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const { width, height } = Dimensions.get('window')

export const getDefaultHeaderHeight = (
  statusBarHeight = 0, platform = Platform, w = width, h = height,
) => {
  const isLandscape = w > h

  let headerHeight

  if (platform.OS === 'ios') {
    if (isLandscape && !platform.isPad) {
      headerHeight = 32
    } else {
      headerHeight = 44
    }
  } else if (platform.OS === 'android') {
    headerHeight = 56
  } else {
    headerHeight = 64
  }

  return headerHeight + statusBarHeight
}

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}
const metrics = {
  screenWidth: width,
  screenHeight: height,
  marginVertical: spacing.lg,
  marginHorizontal: spacing.md,
  isIPhoneX: DeviceInfo.hasNotch(),
  tabBarHeight: 50,
  tabBarFullHeight: 80,
  headerHeight: getDefaultHeaderHeight(),
  spacing,
  headerHeight: 60,
  radius: {
    sm: 5,
    md: 10,
    mid: 15,
    lg: 20,
    xl: 40,
    xxl: 80,
    round: 1000,
  },
  icons: {
    xs: 14,
    sm: 16,
    mid: 18,
    md: 24,
    lg: 30,
    xl: 40,
    xxl: 70,
  },
  aspectRatio: {
    feed: 4 / 3,
    square: 1 / 1,
    vertical: 9 / 16,
  },
}

export default metrics
