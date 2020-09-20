import React, { useState, useCallback, useEffect } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { KeyboardAccessoryView, KeyboardUtils } from 'react-native-ui-lib/keyboard'

import { colors, edgeInsets } from '@app/theme'
import Typography from '@app/shared/components/typography'
import { capitalize } from '@app/shared/helpers/strings'
import { keyboardName } from '@app/shared/components/emoji-selector'

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

export const EmojiPickerToggler = ({ onPress, isActive }) => (
  <TouchableOpacity onPress={onPress} style={styles.emojiPicker} hitSlop={edgeInsets.all(20)}>
    <Ionicon
      name="md-happy"
      size={28}
      color={isActive ? colors.primary : colors.placeholder}
    />
  </TouchableOpacity>
)

export const EmojiKeyboard = ({
  inputRef, showEmojiPicker, onSelectEmoji, hide,
}) => (
  <View style={[styles.emojiSelector, hide && styles.hide]}>
    <KeyboardAccessoryView
      kbComponent={showEmojiPicker ? keyboardName : undefined}
      onItemSelected={onSelectEmoji}
      kbInputRef={inputRef}
    />
  </View>
)

const InputText = React.forwardRef((props, ref) => {
  const {
    onValueChange = () => { },
    onBlur = () => { },
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [blurred, setBlurred] = useState(false)

  const onChangeText = useCallback((newValue) => {
    if (onValueChange) onValueChange(newValue, fieldName)
    if (value !== newValue) {
      setValue(newValue)
    }
  }, [onValueChange, fieldName, value])

  const toggleEmojiPicker = useCallback(() => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false)
    } else {
      KeyboardUtils.dismiss()
      setShowEmojiPicker(true)
    }
    setBlurred(false)
  }, [showEmojiPicker])

  useEffect(() => {
    if (!withEmoji) return
    // eslint-disable-next-line no-unused-expressions
    if (!blurred) ref?.current?.focus()
  }, [showEmojiPicker, ref, blurred, withEmoji])

  const handleFocus = useCallback(() => {
    if (!withEmoji) return
    setBlurred(false)
  }, [withEmoji])

  const handleBlur = useCallback(() => {
    onBlur(fieldName)
    if (showEmojiPicker) {
      setBlurred(true)
      setShowEmojiPicker(false)
    }
  }, [fieldName, onBlur, showEmojiPicker])

  const onSelectEmoji = useCallback((keyboard, emoji) => {
    if (keyboard !== keyboardName) return
    let newValue = null
    setValue((state) => {
      newValue = `${state || ''}${emoji}`
      return newValue
    })
    onChangeText(newValue)
  }, [onChangeText])

  const hasTrailingItem = error || Right

  return (
    <View>
      <View style={[styles.wrapper, wrapperStyle, error && styles.error]}>
        {withEmoji
          ? <EmojiPickerToggler onPress={toggleEmojiPicker} isActive={showEmojiPicker} />
          : Left && <Left />}
        <TextInput
          key={showEmojiPicker}
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
          showSoftInputOnFocus={!showEmojiPicker}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...otherProps}
        />
        {error
          ? <PopoverTooltip message={error} />
          : Right && <Right />}
      </View>
      {withEmoji && (
        <EmojiKeyboard
          hide={blurred}
          inputRef={ref}
          onSelectEmoji={onSelectEmoji}
          showEmojiPicker={showEmojiPicker}
        />
      )}
    </View>
  )
})


export default React.memo(InputText)
