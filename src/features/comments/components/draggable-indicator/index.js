import { memo } from 'react';
import { View } from 'react-native';

import { useAppStyles } from '@app/shared/hooks';

import createThemedStyles from './styles';

const DraggableIndicator = () => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <View style={styles.draggableContainer}>
      <View style={styles.draggableIcon} />
    </View>
  );
};

export default memo(DraggableIndicator);
