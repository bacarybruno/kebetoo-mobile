import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const Theme = {
  marginHorizontal: 16,
  marginVertical: 24,
  screenWidth: width,
  screenHeight: height,
  tabBarHeight: 50,
  tabBarFullHeight: 80,
}

export default Theme
