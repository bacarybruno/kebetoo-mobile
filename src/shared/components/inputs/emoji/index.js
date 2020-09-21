import React, { useState, useCallback, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { KeyboardAccessoryView, KeyboardUtils } from 'react-native-ui-lib/keyboard'

import { colors, edgeInsets } from '@app/theme'
import { keyboardName } from '@app/shared/components/emoji-selector'

import styles from '../styles'
import TextInput from '../text'

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

const EmojiTextInput = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [blurred, setBlurred] = useState(false)

  const onChangeText = useCallback((text) => {
    const { fieldName, onValueChange } = props
    onValueChange(text, fieldName)
    if (text !== value) setValue(text)
  }, [props, value])

  const toggleEmojiPicker = useCallback(() => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false)
    } else {
      KeyboardUtils.dismiss()
      setShowEmojiPicker(true)
    }
    setBlurred(false)
  }, [showEmojiPicker])

  const onKeyboardPress = useCallback(() => {
    if (showEmojiPicker) toggleEmojiPicker()
  }, [showEmojiPicker, toggleEmojiPicker])

  const renderToggler = useCallback(() => (
    <EmojiPickerToggler onPress={toggleEmojiPicker} isActive={showEmojiPicker} />
  ), [showEmojiPicker, toggleEmojiPicker])

  const onSelectEmoji = useCallback((keyboard, emoji) => {
    if (keyboard === keyboardName) {
      let newValue = null
      setValue((state) => {
        newValue = `${state || ''}${emoji}`
        return newValue
      })
      onChangeText(newValue)
    }
  }, [onChangeText])

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (!blurred) ref?.current?.focus()
  }, [showEmojiPicker, ref, blurred])

  const handleBlur = useCallback(() => {
    if (showEmojiPicker) {
      setBlurred(true)
      setShowEmojiPicker(false)
    }
  }, [showEmojiPicker])

  const handleFocus = useCallback(() => {
    setBlurred(false)
  }, [])

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        ref={ref}
        key={showEmojiPicker}
        Left={renderToggler}
        showSoftInputOnFocus={!showEmojiPicker}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={onKeyboardPress}
        {...props}
      />
      <EmojiKeyboard
        hide={blurred}
        inputRef={ref}
        onSelectEmoji={onSelectEmoji}
        showEmojiPicker={showEmojiPicker}
      />
    </View>
  )
})

export default React.memo(EmojiTextInput)
