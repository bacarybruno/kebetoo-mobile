import {
  memo, useState, useCallback, forwardRef,
} from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { useAppStyles } from '@app/shared/hooks';

import TextInput from '../text';
import createThemedStyles from '../styles';

export const EyeButton = ({ secureTextEntry, onPress }) => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
      <Ionicon
        style={styles.icon}
        name={secureTextEntry ? 'ios-eye' : 'ios-eye-off'}
        size={30}
      />
    </TouchableOpacity>
  );
};

const InputPassword = forwardRef((props, ref) => {
  const [value, setValue] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const onChangeText = useCallback((text) => {
    const { fieldName, onValueChange } = props;
    onValueChange(text, fieldName);
    setValue(text);
  }, [props]);

  const togglePassword = useCallback(() => {
    setSecureTextEntry((state) => !state);
  }, []);

  return (
    <TextInput
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      ref={ref}
      {...props}
      Right={(
        <EyeButton secureTextEntry={secureTextEntry} onPress={togglePassword} />
      )}
    />
  );
});

export default memo(InputPassword);
