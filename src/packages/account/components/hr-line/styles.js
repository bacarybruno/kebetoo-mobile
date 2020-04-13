import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: '#707070',
  },
  text: {
    marginHorizontal: 10,
  },
})

export default styles
