import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

const imageSize = 90
const elevation = {
  shadowColor: colors.black,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
}

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
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
    ...elevation,
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
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    ...elevation,
  },
  stat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginRight: 20,
  },
  section: {
    marginTop: 27,
  },
  sectionTitle: {
    marginBottom: 10,
  },
})
