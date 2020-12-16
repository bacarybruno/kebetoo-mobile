import React, { useState, useCallback, useEffect } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { KeyboardAccessoryView, KeyboardUtils } from 'react-native-ui-lib/keyboard'

import { edgeInsets } from '@app/theme'
import { keyboardName } from '@app/shared/components/emoji-selector'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from '../styles'
import TextInput from '../text'

export const EmojiPickerToggler = ({ onPress, isActive }) => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  return (
    <TouchableOpacity onPress={onPress} style={styles.emojiPicker} hitSlop={edgeInsets.all(20)}>
      <Ionicon
        name="md-happy"
        size={28}
        color={isActive ? colors.primary : colors.placeholder}
      />
    </TouchableOpacity>
  )
}

export const EmojiKeyboard = ({
  inputRef, showEmojiPicker, onSelectEmoji, hide,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.emojiSelector, hide && styles.hide]}>
      <KeyboardAccessoryView
        kbComponent={showEmojiPicker ? keyboardName : undefined}
        onItemSelected={onSelectEmoji}
        kbInputRef={inputRef}
      />
    </View>
  )
}

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
        {...props}
        value={value}
        onChangeText={onChangeText}
        ref={ref}
        key={showEmojiPicker}
        Left={Platform.OS === 'android' && renderToggler}
        multiline={Platform.OS === 'android' ? props.multiline : false}
        showSoftInputOnFocus={!showEmojiPicker}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={onKeyboardPress}
      />
      {Platform.OS === 'android' && (
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

export default React.memo(EmojiTextInput)
