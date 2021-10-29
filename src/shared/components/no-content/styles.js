import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default StyleSheet.create({
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.marginHorizontal,
  },
  text: {
    textAlign: 'center',
  },
});
