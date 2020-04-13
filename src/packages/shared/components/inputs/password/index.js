import React, { useState, useCallback, memo } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import styles, { placeholderColor } from '../styles'

const InputPassword = (props) => {
  const [value, setValue] = useState(null)
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const onChangeText = useCallback((text) => {
    const { fieldName } = props
    props.onValueChange(text, fieldName)
    setValue(text)
  }, [setValue, props])

  const togglePassword = useCallback(() => {
    setSecureTextEntry(!secureTextEntry)
  }, [secureTextEntry, setSecureTextEntry])

  return (
    <View style={styles.wrapper}>
      <TextInput
        secureTextEntry={secureTextEntry}
        style={styles.textInput}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        {...props}
      />
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={togglePassword}
      >
        <Ionicon
          style={styles.icon}
          name={secureTextEntry ? 'ios-eye' : 'ios-eye-off'}
          size={30}
        />
      </TouchableOpacity>
    </View>
  )
}

export default memo(InputPassword)
