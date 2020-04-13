import React, {
  useState,
  useCallback,
  memo,
  forwardRef,
} from 'react'
import { View, TextInput } from 'react-native'

import styles, { placeholderColor } from '../styles'

const InputText = forwardRef((props, ref) => {
  const [value, setValue] = useState(null)

  const onChangeText = useCallback((text) => {
    const { fieldName } = props
    props.onValueChange(text, fieldName)
    setValue(text)
  }, [setValue, props])

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.textInput}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        ref={ref}
        {...props}
      />
    </View>
  )
})

export default memo(InputText)
