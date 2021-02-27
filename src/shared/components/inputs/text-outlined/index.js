import React from 'react'

import { TextInput, Typography } from '@app/shared/components'
import { metrics } from '@app/theme'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const TextOutlinedInput = ({
  autoFocus = false,
  onChange,
  text,
  label,
  editable = true,
  borderless = true,
  maxNumberOfLines = 1,
  placeholder,
  maxLength = 180,
  inputRef,
  textStyle,
  wrapperStyle,
  error,
  fieldName,
  ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <>
      <Typography
        style={styles.label}
        type={Typography.types.headline6}
        text={label}
      />
      <TextInput
        multiline
        autoFocus={autoFocus}
        placeholder={placeholder}
        onValueChange={onChange}
        fieldName={fieldName}
        borderless={true}
        error={error}
        returnKeyType="default"
        maxLength={maxLength}
        editable={editable}
        defaultValue={text}
        ref={inputRef}
        inputWrapperStyle={styles.inputWrapper}
        textStyle={[styles.textInput, textStyle]}
        wrapperStyle={[
          styles.textInputWrapper,
          !borderless && styles.border,
          !borderless && error && styles.error,
          wrapperStyle,
        ]}
        numberOfLines={Math.min(
          Math.floor(metrics.screenHeight / 75),
          maxNumberOfLines,
        )}
        {...otherProps}
      />
    </>
  )
}

export default React.memo(TextOutlinedInput)
