import { StyleSheet } from 'react-native'
import Typography from '../typography'

export default StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetings: {
    flex: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    marginLeft: 8,
  },
  icon: {
    width: Typography.fontSizes.header,
    height: Typography.fontSizes.header,
    marginLeft: 4,
  },
})
