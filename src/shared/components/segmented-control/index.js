import { memo, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useAppStyles } from '@app/shared/hooks';

import createThemedStyles from './styles';
import Typography from '../typography';

export const Segment = ({ item, selected, onPress }) => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <TouchableOpacity
      style={[styles.item, styles.bordered, selected && styles.selected]}
      onPress={() => onPress(item)}
    >
      <Typography
        text={item.label}
        type={Typography.types.button}
        systemWeight={Typography.weights.bold}
        systemColor={selected ? 'white' : 'textTertiary'}
        numberOfLines={1}
      />
    </TouchableOpacity>
  );
};

const SegmentedControl = ({
  items, selectedValue, onSelect = () => {}, style, ...otherProps
}) => {
  const [selectedItem, setSelectedItem] = useState({ value: selectedValue });
  const styles = useAppStyles(createThemedStyles);

  useEffect(() => {
    if (selectedValue !== selectedItem.value) {
      onSelect(selectedItem);
    }
  }, [selectedValue, selectedItem, onSelect]);

  if (!items?.length) {
    console.warn('SegmentedControl items should not be empty');
    return null;
  }

  return (
    <View style={[styles.wrapper, styles.bordered, style]} {...otherProps}>
      {items.map((item, index) => (
        <Segment
          key={`item-${item.label}-${item.value}-${index}`}
          item={item}
          selected={selectedItem.value === item.value}
          onPress={setSelectedItem}
        />
      ))}
    </View>
  );
};

export default memo(SegmentedControl);
