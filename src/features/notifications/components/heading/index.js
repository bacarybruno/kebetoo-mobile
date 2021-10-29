import { View } from 'react-native';

import { Badge, Typography } from '@app/shared/components';

import styles from './styles';

const Heading = ({ name, value }) => (
  <View style={styles.header}>
    <Typography
      text={name}
      type={Typography.types.subheading}
      systemWeight={Typography.weights.semibold}
    />
    <Badge text={value} style={styles.headerBadge} />
  </View>
);

export default Heading;
