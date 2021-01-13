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
    flex: 1,
    flexDirection: 'row',
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
})
