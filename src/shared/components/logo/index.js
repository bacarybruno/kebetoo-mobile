import { memo } from 'react';
import { Image } from 'react-native';

import { images } from '@app/theme';

import styles from './styles';

const Logo = ({ style }) => (
  <Image style={[styles.logo, style]} source={images.logo} />
);

export default memo(Logo);
