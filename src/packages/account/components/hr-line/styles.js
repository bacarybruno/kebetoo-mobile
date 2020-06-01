import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: colors.grey,
  },
  text: {
    marginHorizontal: 10,
  },
})

export default styles
