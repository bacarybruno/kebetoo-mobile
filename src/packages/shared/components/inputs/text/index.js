import React, { useState, useCallback } from 'react'
import { View, TextInput } from 'react-native'
import styles, { placeholderColor } from '../styles'

export default (props) => {
  const [value, setValue] = useState(null)

  const onChangeText = useCallback((text) => {
    props.onChangeText(text)
    setValue(text)
  }, [setValue, props])

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.textInput}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  )
}
