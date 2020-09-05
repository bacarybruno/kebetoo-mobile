import { StyleSheet } from 'react-native'

import colors, { hexToRgba, rgbaToHex } from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'
import elevation from 'Kebetoo/src/theme/elevation'

const profileInfoSize = 140
const profileInfoMarginBottom = 25

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    // backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.textPrimary,
  },
  userInfos: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
    paddingHorizontal: metrics.marginHorizontal,
  },
  paddingHorizontal: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  sectionHeader: {
    marginBottom: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listHeader: {
    marginBottom: metrics.marginVertical,
  },
  listHeaderImage: {
    paddingHorizontal: metrics.marginHorizontal,
    aspectRatio: metrics.aspectRatio.square,
  },
  profileInfos: {
    backgroundColor: hexToRgba(rgbaToHex(colors.backgroundSecondary), 0.95),
    ...elevation(3),
    borderRadius: 8,
    height: profileInfoSize,
    marginTop: -profileInfoSize / 2,
    marginHorizontal: metrics.marginHorizontal,
  },
  profileInfoSection: {
    height: '50%',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  stats: {
    width: '100%',
    marginTop: 0,
    height: '100%',
    ...elevation(0),
  },
})
