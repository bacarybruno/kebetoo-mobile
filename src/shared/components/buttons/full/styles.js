import { StyleSheet } from 'react-native'

import defaultStyles from '../styles'

export default StyleSheet.create({
  button: {
    ...defaultStyles.button,
    flexDirection: 'row',
    width: '100%',
  },
  disabledButton: {
    ...defaultStyles.disabledButton,
  },
  loading: {
    ...defaultStyles.loading,
  },
})
