import { StyleSheet } from 'react-native'
import colors from '@app/theme/colors'

const imageSize = 30
export default StyleSheet.create({
  wrapper: {
    width: imageSize,
    height: imageSize,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: imageSize / 2,
    backgroundColor: colors.primary,
  },
})
