import { useState, useCallback, forwardRef } from 'react'
import {
  View, TextInput, TouchableOpacity, Animated,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import { Typography } from '@app/shared/components'
import { capitalize } from '@app/shared/helpers/strings'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from '../styles'

export const ErrorTooltip = (styles, colors) => (
  <TouchableOpacity style={styles.iconWrapper}>
    <Ionicon name="alert-circle" size={28} color={colors.pink} />
  </TouchableOpacity>
)

export const PopoverTooltip = ({ message, from = ErrorTooltip }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <Popover
      from={from(styles, colors)}
      popoverStyle={styles.popover}
      placement={PopoverPlacement.BOTTOM}
    >
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
    Left,
    Right,
    children,
    height,
    inputWrapperStyle,
    borderless,
    inputChildren,
    hideValue,
    ...otherProps
  } = props
  const [value, setValue] = useState("")

  const styles = useAppStyles(createThemedStyles)

  const onChangeText = useCallback((newValue) => {
    if (onValueChange) onValueChange(newValue, fieldName)
    if (!hideValue) {
      setValue(newValue)
    }
  }, [onValueChange, fieldName, hideValue])

  const hasTrailingItem = error || Right

  return (
    <Animated.View
      style={[styles.wrapper, wrapperStyle, height && { height }, error && !borderless && styles.error]}
    >
      {children}
      <View style={[styles.inputWrapper, inputWrapperStyle]}>
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
        >
          {inputChildren}
        </TextInput>
        {error
          ? <PopoverTooltip message={error} />
          : Right}
      </View>
    </Animated.View>
  )
})


export default InputText
