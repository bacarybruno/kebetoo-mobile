import React, { memo } from 'react'
import { View } from 'react-native'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'

import SendButton from '../send-button'
import styles from './styles'


const CommentInput = ({
  onChange, onSend, inputRef, ...inputProps
}) => (
  <View style={styles.commentInputWrapper}>
    <View style={styles.flexible}>
      <TextInput
        fieldName="comment"
        placeholder="Add a comment"
        onValueChange={onChange}
        ref={inputRef}
        textStyle={styles.textInputSize}
        wrapperStyle={[
          styles.textInputSize,
          styles.textInputWrapper,
        ]}
        {...inputProps}
      />
    </View>
    <SendButton onPress={onSend} />
  </View>
)

export default memo(CommentInput)
