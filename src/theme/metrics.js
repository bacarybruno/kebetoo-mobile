import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export default {
  marginHorizontal: 16,
  marginVertical: 24,
  screenWidth: width,
  screenHeight: height,
  tabBarHeight: 50,
}
