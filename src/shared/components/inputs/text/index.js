import React, { useState, useCallback, forwardRef } from 'react'
import {
  View, TextInput, TouchableOpacity, Animated,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import { colors } from '@app/theme'
import { Typography } from '@app/shared/components'
import { capitalize } from '@app/shared/helpers/strings'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from '../styles'

export const ErrorTooltip = (styles) => (
  <TouchableOpacity style={styles.iconWrapper}>
    <Ionicon name="ios-alert" size={28} color={colors.pink} />
  </TouchableOpacity>
)

export const PopoverTooltip = ({ message, from = ErrorTooltip }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Popover from={from(styles)} popoverStyle={styles.popover} placement={PopoverPlacement.BOTTOM}>
      <Typography text={capitalize(message)} />
    </Popover>
  )
}

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
    children,
    height,
    ...otherProps
  } = props
  const [value, setValue] = useState(null)

  const styles = useAppStyles(createThemedStyles)

  const onChangeText = useCallback((newValue) => {
    if (onValueChange) onValueChange(newValue, fieldName)
    setValue(newValue)
  }, [onValueChange, fieldName])

  const hasTrailingItem = error || Right

  return (
    <Animated.View
      style={[styles.wrapper, wrapperStyle, height && { height }, error && styles.error]}
    >
      {children}
      <View style={styles.inputWrapper}>
        {Left && <Left />}
        <TextInput
          style={[
            styles.textInput,
            textStyle,
            hasTrailingItem && styles.trailing,
          ]}
          value={value}
          placeholderTextColor={styles.icon.color}
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
    </Animated.View>
  )
})


export default React.memo(InputText)
