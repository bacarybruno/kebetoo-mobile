import { StyleSheet } from 'react-native'

const imageSize = 30
export default StyleSheet.create({
  wrapper: {
    width: imageSize,
    height: imageSize,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: imageSize / 2,
  },
})
