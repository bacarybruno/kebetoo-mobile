import React, { useState, useCallback, forwardRef } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import { colors } from '@app/theme'
import { Typography } from '@app/shared/components'
import { capitalize } from '@app/shared/helpers/strings'

import styles, { placeholderColor } from '../styles'

export const ErrorTooltip = (
  <TouchableOpacity style={styles.iconWrapper}>
    <Ionicon name="ios-alert" size={28} color={colors.pink} />
  </TouchableOpacity>
)

export const PopoverTooltip = ({ message, from = ErrorTooltip }) => (
  <Popover from={from} popoverStyle={styles.popover} placement={PopoverPlacement.BOTTOM}>
    <Typography text={capitalize(message)} />
  </Popover>
)

const InputText = forwardRef((props, ref) => {
  const {
    onValueChange = () => { },
    onBlur = () => { },
    onFocus = () => { },
    fieldName,
    wrapperStyle,
    textStyle,
    error,
    withEmoji,
    Left,
    Right,
    ...otherProps
  } = props
  const [value, setValue] = useState(null)

  const onChangeText = useCallback((newValue) => {
    if (onValueChange) onValueChange(newValue, fieldName)
    setValue(newValue)
  }, [onValueChange, fieldName])

  const hasTrailingItem = error || Right

  return (
    <View style={[styles.wrapper, wrapperStyle, error && styles.error]}>
      {Left && <Left />}
      <TextInput
        style={[
          styles.textInput,
          textStyle,
          hasTrailingItem && styles.trailing,
        ]}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        ref={ref}
        blurOnSubmit={false}
        onBlur={() => onBlur(fieldName)}
        onFocus={() => onFocus(fieldName)}
        {...otherProps}
      />
      {error
        ? <PopoverTooltip message={error} />
        : Right && <Right />}
    </View>
  )
})


export default React.memo(InputText)
