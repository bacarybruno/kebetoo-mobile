import { metrics } from '@app/theme';
import { StyleSheet } from 'react-native';

import iosColors from '@app/theme/ios-colors';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: iosColors.secondarySystemBackground.dark,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: metrics.marginHorizontal,
  },
  text: {
    color: colors.white,
  },
});
