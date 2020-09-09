import React, { useState, useCallback, forwardRef } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import colors from '@app/theme/colors'
import Typography from '@app/shared/components/typography'
import strings from '@app/config/strings'
import { capitalize } from '@app/shared/helpers/strings'

import styles, { placeholderColor } from '../styles'

export const ErrorTooltip = (
  <TouchableOpacity style={styles.iconWrapper}>
    <Ionicon
      style={{ ...styles.icon, color: colors.pink }}
      name="ios-alert"
      size={28}
      color={colors.pink}
    />
  </TouchableOpacity>
)

export const PopoverTooltip = ({ message = strings.errors.generic, from = ErrorTooltip }) => (
  <Popover from={from} popoverStyle={styles.popover} placement={PopoverPlacement.BOTTOM}>
    <Typography text={capitalize(message)} />
  </Popover>
)

const InputText = forwardRef((props, ref) => {
  const {
    onValueChange,
    onBlur,
    fieldName,
    wrapperStyle,
    textStyle,
    error,
    Left,
    Right,
    ...otherProps
  } = props
  const [value, setValue] = useState(null)

  const onChangeText = useCallback((text) => {
    if (onValueChange) onValueChange(text, fieldName)
    setValue(text)
  }, [setValue, fieldName, onValueChange])

  return (
    <View style={[styles.wrapper, wrapperStyle, error && { borderColor: colors.pink }]}>
      {Left && <Left />}
      <TextInput
        style={[styles.textInput, textStyle]}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        ref={ref}
        blurOnSubmit={false}
        onBlur={() => onBlur(fieldName)}
        {...otherProps}
      />
      {error
        ? <PopoverTooltip message={error} />
        : Right && <Right />}
    </View>
  )
})

InputText.defaultProps = {
  onValueChange: () => {},
  onBlur: () => {},
}

export default React.memo(InputText)
