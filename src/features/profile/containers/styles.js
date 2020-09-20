import { StyleSheet } from 'react-native'

import { colors, metrics, elevation } from '@app/theme'

export const imageSize = 90

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  header: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
  },
  summary: {
    flexDirection: 'row',
  },
  summaryText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    ...elevation(3),
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: imageSize / 2,
    backgroundColor: 'white',
  },
  stats: {
    width: '99%',
    alignSelf: 'center',
    height: 68,
    marginTop: 27,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    flexDirection: 'row',
    ...elevation(1),
  },
  stat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.marginHorizontal / 2,
    paddingHorizontal: metrics.marginHorizontal,
  },
  iconButtonTitle: {
    marginBottom: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginRight: 20,
  },
  section: {
    marginTop: 27,
  },
  sectionTitle: {
    marginBottom: 10,
    paddingHorizontal: metrics.marginHorizontal,
  },
  iconButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    paddingBottom: metrics.marginVertical,
  },
})
