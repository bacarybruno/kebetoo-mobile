import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  noMargin: {
    marginBottom: 0,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  repostHeaderWrapper: {
    marginBottom: 4,
  },
  headerContent: {
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    justifyContent: 'space-between',
    marginLeft: 5,
  },
  repostMeta: {
    justifyContent: 'center',
  },
  smallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    width: 30,
    alignItems: 'center',
  },
  reactions: {
    marginTop: 8,
  },
})
