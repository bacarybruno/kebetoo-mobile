import { Dimensions, Platform } from 'react-native'

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

const metrics = {
  marginHorizontal: 16,
  marginVertical: 24,
  screenWidth: width,
  screenHeight: height,
  tabBarHeight: 50,
  tabBarFullHeight: 80,
  headerHeight: getDefaultHeaderHeight(),
  aspectRatio: {
    feed: 4 / 3,
    square: 1 / 1,
    vertical: 9 / 16,
  },
}

export default metrics
