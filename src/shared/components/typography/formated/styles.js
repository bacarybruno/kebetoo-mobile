import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';

export default (colors) => StyleSheet.create({
  bold: systemWeights.bold,
  semibold: systemWeights.semibold,
  link: {
    color: colors.link,
  },
  italic: {
    fontStyle: 'italic',
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
