import React, { useState, useCallback, forwardRef } from 'react'
import { View, TextInput } from 'react-native'

import styles, { placeholderColor } from '../styles'

const InputText = forwardRef((props, ref) => {
  const {
    onValueChange,
    fieldName,
    wrapperStyle,
    textStyle,
    ...otherProps
  } = props
  const [value, setValue] = useState(null)

  const onChangeText = useCallback((text) => {
    if (onValueChange) onValueChange(text, fieldName)
    setValue(text)
  }, [setValue, fieldName, onValueChange])

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TextInput
        style={[styles.textInput, textStyle]}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        ref={ref}
        blurOnSubmit={false}
        {...otherProps}
      />
    </View>
  )
})

export default React.memo(InputText)
