import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const metrics = {
  marginHorizontal: 16,
  marginVertical: 24,
  screenWidth: width,
  screenHeight: height,
  tabBarHeight: 50,
  tabBarFullHeight: 80,
  aspectRatio: {
    feed: 4 / 3,
    square: 1 / 1,
    vertical: 9 / 16,
  },
}

export default metrics
